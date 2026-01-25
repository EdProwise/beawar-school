import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const iconOptions = ["Monitor", "BookOpen", "FlaskConical", "Dumbbell", "Bus", "Wifi", "Building", "Laptop", "Music", "Palette", "Utensils", "Shield"];

interface Facility {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminFacilities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Facility | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "Building",
    image_url: "",
    is_active: true,
  });

  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ["admin-facilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Facility[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Facility>) => {
      if (editingItem) {
        const { error } = await supabase.from("facilities").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("facilities").insert([{ ...data, sort_order: facilities.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({ title: editingItem ? "Facility updated!" : "Facility added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("facilities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({ title: "Facility deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("facilities").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", icon_name: "Building", image_url: "", is_active: true });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Facility) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      icon_name: item.icon_name || "Building",
      image_url: item.image_url || "",
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
          <h1 className="text-3xl font-bold text-foreground">Facilities</h1>
          <p className="text-muted-foreground">Manage school facilities displayed on website</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Facility" : "Add New Facility"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Smart Classrooms"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
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
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((item) => (
          <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden group">
            {item.image_url && (
              <div className="h-40 overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Icon: {item.icon_name}</span>
                <Switch
                  checked={item.is_active}
                  onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, is_active: checked })}
                />
              </div>
            </div>
          </div>
        ))}
        {facilities.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No facilities yet. Add your first facility.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
