import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
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

const iconOptions = ["Star", "Award", "Users", "Globe", "Building", "Target", "Heart", "Lightbulb", "CheckCircle", "Shield"];

interface HighlightCard {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminHighlights() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HighlightCard | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "Star",
    is_active: true,
  });

  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ["admin-highlight-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("highlight_cards")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as HighlightCard[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<HighlightCard>) => {
      if (editingItem) {
        const { error } = await supabase.from("highlight_cards").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("highlight_cards").insert([{ ...data, sort_order: highlights.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-highlight-cards"] });
      queryClient.invalidateQueries({ queryKey: ["highlight-cards"] });
      toast({ title: editingItem ? "Highlight updated!" : "Highlight added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("highlight_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-highlight-cards"] });
      queryClient.invalidateQueries({ queryKey: ["highlight-cards"] });
      toast({ title: "Highlight deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("highlight_cards").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-highlight-cards"] });
      queryClient.invalidateQueries({ queryKey: ["highlight-cards"] });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", icon_name: "Star", is_active: true });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: HighlightCard) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      icon_name: item.icon_name || "Star",
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
          <h1 className="text-3xl font-bold text-foreground">Highlight Cards</h1>
          <p className="text-muted-foreground">Manage "Why Choose Us" highlight cards on About section</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Highlight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Highlight" : "Add New Highlight"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Expert Faculty"
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
                  placeholder="Brief description of this highlight..."
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
          <div key={item.id} className="bg-card rounded-xl border border-border p-5 relative group">
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm" onClick={() => handleEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive bg-background/80 backdrop-blur-sm"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-3">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                {item.icon_name || "Star"}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <Switch
                checked={item.is_active}
                onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, is_active: checked })}
              />
              <span className="text-xs text-muted-foreground">
                {item.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
        {highlights.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No highlights yet. Add your first highlight card.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
