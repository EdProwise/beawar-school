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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Tag } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  discount: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminOffers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    discount: "",
    is_active: true,
  });

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Offer[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Offer>) => {
      if (editingItem) {
        const { error } = await supabase.from("offers").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("offers").insert([{ ...data, sort_order: offers.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: editingItem ? "Offer updated!" : "Offer added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "Offer deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("offers").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", code: "", discount: "", is_active: true });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Offer) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      code: item.code || "",
      discount: item.discount || "",
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
          <h1 className="text-3xl font-bold text-foreground font-heading">Offers Management</h1>
          <p className="text-muted-foreground">Manage school offers and promotions shown in the Alibaba Lamp</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Offer" : "Add New Offer"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Offer Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Early Bird Discount"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the offer..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ORBIT20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount / Value</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="20% Off"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Offer Active</Label>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editingItem ? "Update Offer" : "Create Offer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Tag className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive rounded-lg"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this offer?")) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {item.discount && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-md">
                    {item.discount}
                  </span>
                )}
                {item.code && (
                  <span className="px-2 py-1 bg-secondary text-foreground text-xs font-mono rounded-md border border-border">
                    CODE: {item.code}
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, is_active: checked })}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.is_active ? "Active" : "Disabled"}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Order: {item.sort_order}
                </span>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <div className="col-span-full bg-card/50 border-2 border-dashed border-border rounded-3xl p-12 text-center">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No offers available</h3>
            <p className="text-muted-foreground mb-6">Create your first offer to show it in the Aladdin's Lamp on the homepage.</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Offer
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
