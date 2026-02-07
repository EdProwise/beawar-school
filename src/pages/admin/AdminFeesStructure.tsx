import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminFeesStructure() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [form, setForm] = useState({ 
    academic_year: "",
    grade: "", 
    admission_fee: "", 
    registration_fee: "",
    school_fee: "",
    boarding_fee: ""
  });

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ["admin-fees-structure"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fees_structure").select("*").order("grade");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (editingFee) {
        const { error } = await supabase.from("fees_structure").update(data).eq("id", editingFee.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fees_structure").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fees-structure"] });
      toast({ title: editingFee ? "Fee updated!" : "Fee added!" });
      resetForm();
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fees_structure").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fees-structure"] });
      toast({ title: "Fee deleted!" });
    },
  });

  const resetForm = () => {
    setForm({ 
      academic_year: fees[0]?.academic_year || "",
      grade: "", 
      admission_fee: "", 
      registration_fee: "",
      school_fee: "",
      boarding_fee: ""
    });
    setEditingFee(null);
    setDialogOpen(false);
  };

  const handleEdit = (fee: any) => {
    setEditingFee(fee);
    setForm({
      academic_year: fee.academic_year || "",
      grade: fee.grade,
      admission_fee: fee.admission_fee || "",
      registration_fee: fee.registration_fee || "",
      school_fee: fee.school_fee || "",
      boarding_fee: fee.boarding_fee || ""
    });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fees Structure</h1>
          <p className="text-muted-foreground">Manage school fees for different grades</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" /> Add Fee Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFee ? "Edit Fee Entry" : "Add Fee Entry"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Academic Year *</Label>
                  <Input 
                    placeholder="e.g. 2026-27"
                    value={form.academic_year} 
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <Label>Grade/Class *</Label>
                  <Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Admission Fee</Label>
                  <Input value={form.admission_fee} onChange={(e) => setForm({ ...form, admission_fee: e.target.value })} />
                </div>
                <div>
                  <Label>Registration Fee</Label>
                  <Input value={form.registration_fee} onChange={(e) => setForm({ ...form, registration_fee: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>School Fee</Label>
                  <Input value={form.school_fee} onChange={(e) => setForm({ ...form, school_fee: e.target.value })} />
                </div>
                <div>
                  <Label>Boarding Fee</Label>
                  <Input value={form.boarding_fee} onChange={(e) => setForm({ ...form, boarding_fee: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingFee ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-6 py-4 font-semibold">Year</th>
                  <th className="px-6 py-4 font-semibold">Grade</th>
                  <th className="px-6 py-4 font-semibold text-center">Admission</th>
                  <th className="px-6 py-4 font-semibold text-center">Registration</th>
                  <th className="px-6 py-4 font-semibold text-center">School Fee</th>
                  <th className="px-6 py-4 font-semibold text-center">Boarding</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fees.map((fee: any) => (
                  <tr key={fee.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">{fee.academic_year || "-"}</td>
                    <td className="px-6 py-4 font-medium">{fee.grade}</td>
                    <td className="px-6 py-4 text-center">{fee.admission_fee || "-"}</td>
                    <td className="px-6 py-4 text-center">{fee.registration_fee || "-"}</td>
                    <td className="px-6 py-4 text-center">{fee.school_fee || "-"}</td>
                    <td className="px-6 py-4 text-center">{fee.boarding_fee || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(fee)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                          if (confirm("Are you sure you want to delete this record?")) {
                            deleteMutation.mutate(fee.id);
                          }
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No fee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
