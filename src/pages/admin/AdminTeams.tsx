import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Users, ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { useTeams, type TeamMember } from "@/hooks/use-school-data";
import { FileUpload } from "@/components/admin/FileUpload";

export default function AdminTeams() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: teams, isLoading } = useTeams();
  const [localTeams, setLocalTeams] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (teams) setLocalTeams(teams);
  }, [teams]);

  const teamMutation = useMutation({
    mutationFn: async (values: TeamMember[]) => {
      // Get existing IDs to identify what to delete
      const { data: existingData } = await supabase.from("our_teams").select("id");
      const existingIds = existingData?.map(v => v.id) || [];
      const currentIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = existingIds.filter(id => !currentIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("our_teams").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("our_teams").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("our_teams").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["our_teams"] });
      toast({ title: "Team members saved successfully!" });
    },
    onError: (error) => {
      console.error("Save error:", error);
      toast({ title: "Error saving team members", variant: "destructive" });
    }
  });

  const handleAddMember = () => {
    const newVal: TeamMember = {
      id: `temp-${Date.now()}`,
      name: "New Member",
      position: "",
      description: "",
      images: [],
      is_active: true,
      sort_order: localTeams.length,
    };
    setLocalTeams([...localTeams, newVal]);
  };

  const handleUpdateMember = (id: string, updates: Partial<TeamMember>) => {
    setLocalTeams(localTeams.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const handleRemoveMember = (id: string) => {
    setLocalTeams(localTeams.filter(v => v.id !== id));
  };

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newTeams = [...localTeams];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTeams.length) return;

    [newTeams[index], newTeams[targetIndex]] = [newTeams[targetIndex], newTeams[index]];
    
    // Update sort_order for all
    const updatedTeams = newTeams.map((member, idx) => ({
      ...member,
      sort_order: idx
    }));
    
    setLocalTeams(updatedTeams);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    teamMutation.mutate(localTeams);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Our Teams</h1>
            <p className="text-muted-foreground">Manage your school's team members, positions, and descriptions</p>
          </div>
          <Button onClick={handleAddMember} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {localTeams.map((member, index) => (
              <div key={member.id} className="bg-card rounded-xl border border-border p-6 shadow-sm relative group">
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => moveMember(index, 'up')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === localTeams.length - 1}
                    onClick={() => moveMember(index, 'down')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Member Image
                    </Label>
                    <FileUpload
                      currentUrl={member.images?.[0]}
                      onUpload={(url) => {
                        const newImages = url ? [url] : [];
                        handleUpdateMember(member.id, { images: newImages });
                      }}
                    />
                    <div className="mt-4">
                      <Label htmlFor={`active-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id={`active-${member.id}`}
                          checked={member.is_active}
                          onChange={(e) => handleUpdateMember(member.id, { is_active: e.target.checked })}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium">Active Member</span>
                      </Label>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor={`name-${member.id}`}>Name</Label>
                      <Input
                        id={`name-${member.id}`}
                        value={member.name}
                        onChange={(e) => handleUpdateMember(member.id, { name: e.target.value })}
                        placeholder="e.g., Dr. Jane Smith"
                      />
                    </div>
                      <div>
                        <Label htmlFor={`position-${member.id}`}>Position</Label>
                        <Input
                          id={`position-${member.id}`}
                          value={member.position}
                          onChange={(e) => handleUpdateMember(member.id, { position: e.target.value })}
                          placeholder="e.g., Principal"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`email-${member.id}`}>Email ID</Label>
                        <Input
                          id={`email-${member.id}`}
                          value={member.email || ""}
                          onChange={(e) => handleUpdateMember(member.id, { email: e.target.value })}
                          placeholder="e.g., jane.smith@school.com"
                        />
                      </div>

                    <div>
                      <RichTextEditor
                        label="Long Description"
                        value={member.description}
                        onChange={(content) => handleUpdateMember(member.id, { description: content })}
                        placeholder="Detailed background and experience..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {localTeams.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No team members added yet.</p>
                <Button variant="outline" onClick={handleAddMember} className="mt-4">
                  Add Your First Member
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border mt-12 z-10">
            <Button
              type="submit"
              size="lg"
              className="px-12"
              disabled={teamMutation.isPending}
            >
              {teamMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Team Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
