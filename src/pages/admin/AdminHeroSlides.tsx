import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminHeroSlides() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    cta_primary_text: "Apply Now",
    cta_primary_link: "/admissions",
    cta_secondary_text: "",
    cta_secondary_link: "",
    is_active: true,
    sort_order: 0,
  });

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["admin-hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<HeroSlide>) => {
      if (editingSlide) {
        const { error } = await supabase
          .from("hero_slides")
          .update(data)
          .eq("id", editingSlide.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("hero_slides")
          .insert([{ ...data, sort_order: slides.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast({ title: editingSlide ? "Slide updated!" : "Slide added!" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error saving slide", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast({ title: "Slide deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("hero_slides")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      cta_primary_text: "Apply Now",
      cta_primary_link: "/admissions",
      cta_secondary_text: "",
      cta_secondary_link: "",
      is_active: true,
      sort_order: 0,
    });
    setEditingSlide(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      image_url: slide.image_url,
      cta_primary_text: slide.cta_primary_text || "",
      cta_primary_link: slide.cta_primary_link || "",
      cta_secondary_text: slide.cta_secondary_text || "",
      cta_secondary_link: slide.cta_secondary_link || "",
      is_active: slide.is_active,
      sort_order: slide.sort_order,
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
          <h1 className="text-3xl font-bold text-foreground">Hero Slides</h1>
          <p className="text-muted-foreground">Manage homepage banner slides</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Edit Slide" : "Add New Slide"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label>Background Image *</Label>
                <FileUpload
                  accept="image"
                  currentUrl={formData.image_url}
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                />
                <p className="text-xs text-muted-foreground mt-1">Or enter URL manually:</p>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cta_primary_text">Primary Button Text</Label>
                  <Input
                    id="cta_primary_text"
                    value={formData.cta_primary_text}
                    onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cta_primary_link">Primary Button Link</Label>
                  <Input
                    id="cta_primary_link"
                    value={formData.cta_primary_link}
                    onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cta_secondary_text">Secondary Button Text</Label>
                  <Input
                    id="cta_secondary_text"
                    value={formData.cta_secondary_text}
                    onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cta_secondary_link">Secondary Button Link</Label>
                  <Input
                    id="cta_secondary_link"
                    value={formData.cta_secondary_link}
                    onChange={(e) => setFormData({ ...formData, cta_secondary_link: e.target.value })}
                  />
                </div>
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
                  {editingSlide ? "Update" : "Add"} Slide
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
              <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{slide.title}</h3>
              {slide.subtitle && <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={slide.is_active}
                onCheckedChange={(checked) => toggleMutation.mutate({ id: slide.id, is_active: checked })}
              />
              <Button variant="ghost" size="icon" onClick={() => handleEdit(slide)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => deleteMutation.mutate(slide.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No slides yet. Add your first hero slide.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
