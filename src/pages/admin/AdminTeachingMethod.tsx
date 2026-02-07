import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Layout, Sparkles, Save } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTeachingMethods, useTeachingMethodHero, type TeachingMethodSection, type TeachingMethodHero } from "@/hooks/use-school-data";

export default function AdminTeachingMethod() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeachingMethodSection | null>(null);
  
  const { data: methods = [], isLoading: methodsLoading } = useTeachingMethods();
  const { data: heroData, isLoading: heroLoading } = useTeachingMethodHero();

  const [heroForm, setHeroForm] = useState<Partial<TeachingMethodHero>>({
    title: "",
    center_image: "",
    images: [],
    description: ""
  });

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    images: [] as string[],
  });

  // Initialize hero form when data is loaded
  useEffect(() => {
    if (heroData) {
      setHeroForm({
        title: heroData.title,
        center_image: heroData.center_image,
        images: heroData.images || [],
        description: heroData.description || ""
      });
    }
  }, [heroData]);

  const saveMethodMutation = useMutation({
    mutationFn: async (data: Partial<TeachingMethodSection>) => {
      if (editingItem) {
        const { error } = await supabase.from("teaching_methods").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("teaching_methods").insert([{ ...data, sort_order: methods.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teaching-methods"] });
      toast({ title: editingItem ? "Method updated!" : "Method added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error saving teaching method", variant: "destructive" }),
  });

  const deleteMethodMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teaching_methods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teaching-methods"] });
      toast({ title: "Method deleted!" });
    },
  });

  const saveHeroMutation = useMutation({
    mutationFn: async (values: Partial<TeachingMethodHero>) => {
      if (heroData?.id) {
        const { error } = await supabase.from("teaching_method_content").update(values).eq("id", heroData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("teaching_method_content").insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teaching-method-hero"] });
      toast({ title: "Hero section updated successfully" });
    },
    onError: () => toast({ title: "Error saving hero section", variant: "destructive" })
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image_url: "",
      images: [],
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: TeachingMethodSection) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content || "",
      image_url: item.image_url || "",
      images: item.images || [],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMethodMutation.mutate(formData);
  };

  if (methodsLoading || heroLoading) {
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
          <h1 className="text-3xl font-bold text-foreground">Teaching Methods</h1>
          <p className="text-muted-foreground">Manage teaching methods and pedagogical approach</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Teaching Method" : "Add New Teaching Method"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Project-Based Learning"
                  required
                />
              </div>
              <div>
                <RichTextEditor
                  label="Content"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
                <div>
                  <Label>Method Images</Label>
                  <FileUpload
                    multiple
                    currentUrl={formData.image_url}
                    currentUrls={formData.images}
                    onUpload={(url) => setFormData({ ...formData, image_url: url })}
                    onMultiUpload={(urls) => setFormData({ ...formData, images: urls })}
                  />
                </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMethodMutation.isPending}>
                  {saveMethodMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editingItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        {/* Hero Section Management */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/50 border-b border-border/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              Hero Section
            </CardTitle>
            <CardDescription>Configure the main heading and image for the Teaching Method page</CardDescription>
          </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input
                      value={heroForm.title || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      placeholder="Enter page title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Page Description</Label>
                    <Input
                      value={heroForm.description || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                      placeholder="Enter short introduction"
                    />
                  </div>
                  <Button 
                    onClick={() => saveHeroMutation.mutate(heroForm)} 
                    disabled={saveHeroMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {saveHeroMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Hero Section
                  </Button>
                </div>
                  <div className="space-y-2">
                    <Label>Hero Images</Label>
                    <FileUpload
                      multiple
                      currentUrl={heroForm.center_image || ""}
                      currentUrls={heroForm.images || []}
                      onUpload={(url) => setHeroForm({ ...heroForm, center_image: url })}
                      onMultiUpload={(urls) => setHeroForm({ ...heroForm, images: urls })}
                      className="aspect-video rounded-xl"
                    />
                  </div>
              </div>
            </CardContent>
        </Card>

        {/* Methods Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <div key={method.id} className="bg-card rounded-xl border border-border overflow-hidden relative group flex flex-col shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={method.image_url || (method.images && method.images[0]) || "/classroom.png"} 
                    alt={method.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {method.images && method.images.length > 1 && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {method.images.length} images
                    </div>
                  )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => handleEdit(method)}>
                    <Pencil className="w-4 h-4 text-foreground" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteMethodMutation.mutate(method.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                  Method {index + 1}
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-foreground mb-2 line-clamp-1">{method.title}</h3>
                <div className="text-sm text-muted-foreground line-clamp-3 prose-sm" dangerouslySetInnerHTML={{ __html: method.content }} />
              </div>
            </div>
          ))}
          {methods.length === 0 && (
            <div className="col-span-full text-center py-20 bg-muted/30 border-2 border-dashed border-border rounded-2xl">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No teaching methods yet</h3>
              <p className="text-muted-foreground mb-6">Start by adding your first pedagogical approach</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Method
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
