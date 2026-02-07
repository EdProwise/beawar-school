import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, BookOpen } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface CurriculumSection {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

export default function AdminCurriculum() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: curriculumData, isLoading } = useQuery({
    queryKey: ["admin-curriculum"],
    queryFn: async () => {
      const { data, error } = await supabase.from("curriculum").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CurriculumSection[];
    }
  });

  const [sections, setSections] = useState<CurriculumSection[]>([]);

  useEffect(() => {
    if (curriculumData) setSections(curriculumData);
  }, [curriculumData]);

  const saveMutation = useMutation({
    mutationFn: async (values: CurriculumSection[]) => {
      // Handle deletions
      const { data: currentDbItems } = await supabase.from("curriculum").select("id");
      const dbIds = currentDbItems?.map(item => item.id) || [];
      const incomingIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = dbIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("curriculum").delete().in("id", toDelete);
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          await supabase.from("curriculum").insert([rest]);
        } else {
          await supabase.from("curriculum").update(val).eq("id", val.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-curriculum"] });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      toast({ title: "Curriculum updated successfully" });
    },
    onError: () => toast({ title: "Error saving changes", variant: "destructive" })
  });

  const handleAddSection = () => {
    setSections([...sections, {
      id: `temp-${Date.now()}`,
      title: "New Section",
      content: "",
      sort_order: sections.length
    }]);
  };

  const handleUpdateSection = (id: string, updates: Partial<CurriculumSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(sections);
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Curriculum Management</h1>
            <p className="text-muted-foreground">Manage the educational curriculum sections</p>
          </div>
          <Button onClick={handleAddSection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-card rounded-xl border border-border p-6 shadow-sm relative group">
              <button
                type="button"
                onClick={() => handleRemoveSection(section.id)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                    placeholder="e.g., Primary Curriculum"
                  />
                </div>
                  <div>
                    <Label>Content</Label>
                    <RichTextEditor
                      value={section.content}
                      onChange={(content) => handleUpdateSection(section.id, { content })}
                    />
                  </div>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No sections added yet. Click "Add Section" to start.</p>
            </div>
          )}

          <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border">
            <Button type="submit" size="lg" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Curriculum
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
