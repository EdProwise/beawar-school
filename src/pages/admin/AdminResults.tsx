import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Trophy, Image as ImageIcon } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

interface Result {
  id: string;
  year: string;
  student_name: string;
  percentage: string;
  remarks: string;
  photo_url?: string;
  category: string;
  sort_order: number;
}

export default function AdminResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: resultsData, isLoading } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const { data, error } = await supabase.from("results").select("*").order("year", { ascending: false }).order("percentage", { ascending: false });
      if (error) throw error;
      return data as Result[];
    }
  });

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (resultsData) setResults(resultsData);
  }, [resultsData]);

  const saveMutation = useMutation({
    mutationFn: async (values: Result[]) => {
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

  const handleAddResult = () => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    
    setResults([{
      id: `temp-${Date.now()}`,
      year: academicYear,
      student_name: "",
      percentage: "",
      remarks: "Outstanding Performance!",
      category: "Board Results",
      sort_order: results.length
    }, ...results]);
  };

  const handleUpdateResult = (id: string, updates: Partial<Result>) => {
    setResults(results.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleRemoveResult = (id: string) => {
    setResults(results.filter(r => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(results);
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
      <div className="max-w-5xl pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Results Management</h1>
            <p className="text-muted-foreground">Manage student achievements and board results</p>
          </div>
          <Button onClick={handleAddResult} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Student Result
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <div key={result.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm relative group hover:border-amber-200 transition-all">
                <button
                  type="button"
                  onClick={() => handleRemoveResult(result.id)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex gap-6">
                  <div className="w-32 shrink-0">
                    <Label className="mb-2 block">Student Photo</Label>
                    <FileUpload
                      value={result.photo_url}
                      onChange={(url) => handleUpdateResult(result.id, { photo_url: url })}
                      folder="results"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Academic Year</Label>
                        <Input
                          value={result.year}
                          onChange={(e) => handleUpdateResult(result.id, { year: e.target.value })}
                          placeholder="2023-24"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={result.category}
                          onChange={(e) => handleUpdateResult(result.id, { category: e.target.value })}
                          placeholder="Class X / Class XII"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Student Name</Label>
                      <Input
                        value={result.student_name}
                        onChange={(e) => handleUpdateResult(result.id, { student_name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Percentage / Score</Label>
                        <Input
                          value={result.percentage}
                          onChange={(e) => handleUpdateResult(result.id, { percentage: e.target.value })}
                          placeholder="e.g. 98.4"
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          type="number"
                          value={result.sort_order}
                          onChange={(e) => handleUpdateResult(result.id, { sort_order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Remarks / Quote</Label>
                      <Input
                        value={result.remarks}
                        onChange={(e) => handleUpdateResult(result.id, { remarks: e.target.value })}
                        placeholder="e.g. School Topper"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
              <Trophy className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">Click the button above to add your first student result.</p>
              <Button onClick={handleAddResult} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Result
              </Button>
            </div>
          )}

          <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border z-20">
            <Button type="submit" size="lg" disabled={saveMutation.isPending} className="bg-amber-600 hover:bg-amber-700 min-w-[200px] shadow-lg shadow-amber-600/20">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Academic Records
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
