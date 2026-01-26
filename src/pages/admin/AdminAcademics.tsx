import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Award, Users, Clock, Target, CheckCircle, GraduationCap, Lightbulb, BookOpen } from "lucide-react";
import { useAcademicExcellence, type AcademicExcellence } from "@/hooks/use-school-data";

const iconOptions = [
  { name: "Users", icon: Users },
  { name: "Award", icon: Award },
  { name: "Clock", icon: Clock },
  { name: "Target", icon: Target },
  { name: "CheckCircle", icon: CheckCircle },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "BookOpen", icon: BookOpen },
];

export default function AdminAcademics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: excellenceHighlights, isLoading } = useAcademicExcellence();
  const [localHighlights, setLocalHighlights] = useState<AcademicExcellence[]>([]);

  useEffect(() => {
    if (excellenceHighlights) setLocalHighlights(excellenceHighlights);
  }, [excellenceHighlights]);

  const highlightMutation = useMutation({
    mutationFn: async (values: AcademicExcellence[]) => {
      // Get current IDs from DB to identify deletions
      const { data: currentDbItems } = await supabase.from("academic_excellence").select("id");
      const dbIds = currentDbItems?.map(item => item.id) || [];
      const incomingIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = dbIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("academic_excellence").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("academic_excellence").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("academic_excellence").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-excellence"] });
      toast({ title: "Academics content updated successfully" });
    },
    onError: (error) => {
      console.error("Error saving academics content:", error);
      toast({ title: "Error saving changes", variant: "destructive" });
    }
  });

  const handleAddHighlight = () => {
    const newVal: AcademicExcellence = {
      id: `temp-${Date.now()}`,
      title: "New Highlight",
      description: "",
      icon_name: "Award",
      is_active: true,
      sort_order: localHighlights.length,
    };
    setLocalHighlights([...localHighlights, newVal]);
  };

  const handleUpdateHighlight = (id: string, updates: Partial<AcademicExcellence>) => {
    setLocalHighlights(localHighlights.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const handleRemoveHighlight = (id: string) => {
    setLocalHighlights(localHighlights.filter(h => h.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    highlightMutation.mutate(localHighlights);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Academics Content</h1>
          <p className="text-muted-foreground">Manage the "Why Choose Us" section on the Academics page</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Why Choose Us (Academic Excellence)
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={handleAddHighlight}>
                <Plus className="w-4 h-4 mr-2" />
                Add Highlight
              </Button>
            </div>

            <div className="space-y-6">
              {localHighlights.map((highlight) => (
                <div key={highlight.id} className="p-5 bg-background rounded-lg border border-border relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(highlight.id)}
                    className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={highlight.title}
                          onChange={(e) => handleUpdateHighlight(highlight.id, { title: e.target.value })}
                          placeholder="e.g., Small Class Sizes"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Icon</Label>
                        <div className="flex flex-wrap gap-2">
                          {iconOptions.map((opt) => (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => handleUpdateHighlight(highlight.id, { icon_name: opt.name })}
                              className={`p-2 rounded-md border transition-all ${
                                highlight.icon_name === opt.name 
                                  ? "bg-primary text-primary-foreground border-primary" 
                                  : "bg-card border-border hover:border-primary"
                              }`}
                              title={opt.name}
                            >
                              <opt.icon className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={highlight.description || ""}
                        onChange={(e) => handleUpdateHighlight(highlight.id, { description: e.target.value })}
                        rows={5}
                        placeholder="Briefly describe this academic highlight..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              {localHighlights.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No highlights added yet. Click "Add Highlight" to start.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border mt-12">
            <Button
              type="submit"
              size="lg"
              className="px-12"
              disabled={highlightMutation.isPending}
            >
              {highlightMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Academics Content
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
