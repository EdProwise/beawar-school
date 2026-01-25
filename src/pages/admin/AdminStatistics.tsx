import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const iconOptions = ["Users", "GraduationCap", "Calendar", "TrendingUp", "Award", "BookOpen", "Target", "Star"];

interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminStatistics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: 0,
    suffix: "+",
    icon_name: "Users",
    is_active: true,
  });

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["admin-statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Statistic[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Statistic>) => {
      if (editingItem) {
        const { error } = await supabase.from("statistics").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("statistics").insert([{ ...data, sort_order: stats.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast({ title: editingItem ? "Statistic updated!" : "Statistic added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("statistics").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast({ title: "Statistic deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("statistics").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });

  const resetForm = () => {
    setFormData({ label: "", value: 0, suffix: "+", icon_name: "Users", is_active: true });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Statistic) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      value: item.value,
      suffix: item.suffix || "+",
      icon_name: item.icon_name || "Users",
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
          <p className="text-muted-foreground">Manage counter statistics displayed on homepage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Statistic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Statistic" : "Add New Statistic"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Label *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Students"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Value *</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="+ or %"
                  />
                </div>
              </div>
              <div>
                <Label>Icon</Label>
                <Select
                  value={formData.icon_name}
                  onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-card rounded-xl border border-border p-6 text-center relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(stat)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(stat.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-4xl font-bold text-primary mb-2">
              {stat.value.toLocaleString()}{stat.suffix}
            </p>
            <p className="text-muted-foreground">{stat.label}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Switch
                checked={stat.is_active}
                onCheckedChange={(checked) => toggleMutation.mutate({ id: stat.id, is_active: checked })}
              />
              <span className="text-xs text-muted-foreground">{stat.is_active ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
        {stats.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No statistics yet. Add your first statistic.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
