import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Trophy } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface ResultSection {
  id: string;
  year: string;
  category: string; // e.g. Board Results, Internal Exams
  title: string;
  content: string;
  sort_order: number;
}

export default function AdminResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: resultsData, isLoading } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const { data, error } = await supabase.from("results").select("*").order("year", { ascending: false }).order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ResultSection[];
    }
  });

  const [sections, setSections] = useState<ResultSection[]>([]);

  useEffect(() => {
    if (resultsData) setSections(resultsData);
  }, [resultsData]);

  const saveMutation = useMutation({
    mutationFn: async (values: ResultSection[]) => {
      // Use upsert for all items
      const itemsToUpsert = values.map(v => {
        if (v.id.startsWith("temp-")) {
          const { id, ...rest } = v;
          return rest;
        }
        return v;
      });

      const { data: currentDbItems } = await supabase.from("results").select("id");
      const dbIds = currentDbItems?.map(item => item.id) || [];
      const incomingIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = dbIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("results").delete().in("id", toDelete);
      }

      const { error } = await supabase.from("results").upsert(itemsToUpsert);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
      toast({ title: "Results updated successfully" });
    },
    onError: (error) => {
      console.error("Save error:", error);
      toast({ title: "Error saving changes", variant: "destructive" });
    }
  });

  const handleAddSection = () => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    
    setSections([{
      id: `temp-${Date.now()}`,
      year: academicYear,
      category: "Board Results",
      title: "Class X Results",
      content: "",
      sort_order: sections.length
    }, ...sections]);
  };

  const handleUpdateSection = (id: string, updates: Partial<ResultSection>) => {
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
            <h1 className="text-3xl font-bold text-foreground font-heading">Results Management</h1>
            <p className="text-muted-foreground">Manage academic results year-wise</p>
          </div>
          <Button onClick={handleAddSection} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Result
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-card rounded-xl border border-border p-6 shadow-sm relative group hover:border-amber-200 transition-colors">
              <button
                type="button"
                onClick={() => handleRemoveSection(section.id)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Academic Year</Label>
                  <Input
                    value={section.year}
                    onChange={(e) => handleUpdateSection(section.id, { year: e.target.value })}
                    placeholder="e.g., 2023-24"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={section.category}
                    onChange={(e) => handleUpdateSection(section.id, { category: e.target.value })}
                    placeholder="e.g., Board Results"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                    placeholder="e.g., Class X Achievement"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Content / Highlights</Label>
                  <RichTextEditor
                    content={section.content}
                    onChange={(content) => handleUpdateSection(section.id, { content })}
                  />
                </div>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No results added yet. Click "Add New Result" to start.</p>
            </div>
          )}

          <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
            <Button type="submit" size="lg" disabled={saveMutation.isPending} className="bg-amber-600 hover:bg-amber-700">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save All Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
