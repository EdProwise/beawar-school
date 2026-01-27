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

const iconOptions = ["Baby", "BookOpen", "GraduationCap", "Award", "Lightbulb", "Users", "Brain", "Palette"];

interface AcademicProgram {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  grade_range: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminPrograms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicProgram | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon_name: "BookOpen",
    image_url: "",
    grade_range: "",
    is_active: true,
  });

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["admin-academic-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_programs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as AcademicProgram[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AcademicProgram>) => {
      if (editingItem) {
        const { error } = await supabase.from("academic_programs").update(data).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("academic_programs").insert([{ ...data, sort_order: programs.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-academic-programs"] });
      queryClient.invalidateQueries({ queryKey: ["academic-programs"] });
      toast({ title: editingItem ? "Program updated!" : "Program added!" });
      resetForm();
    },
    onError: () => toast({ title: "Error saving program", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("academic_programs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-academic-programs"] });
      queryClient.invalidateQueries({ queryKey: ["academic-programs"] });
      toast({ title: "Program deleted!" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("academic_programs").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-academic-programs"] });
      queryClient.invalidateQueries({ queryKey: ["academic-programs"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      icon_name: "BookOpen",
      image_url: "",
      grade_range: "",
      is_active: true,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: AcademicProgram) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      icon_name: item.icon_name || "BookOpen",
      image_url: item.image_url || "",
      grade_range: item.grade_range || "",
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
          <h1 className="text-3xl font-bold text-foreground">Academic Programs</h1>
          <p className="text-muted-foreground">Manage academic programs displayed on website</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Program" : "Add New Program"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Pre-Primary"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Ages 3-5"
                />
              </div>
              <div>
                <Label htmlFor="grade_range">Grade Range</Label>
                <Input
                  id="grade_range"
                  value={formData.grade_range}
                  onChange={(e) => setFormData({ ...formData, grade_range: e.target.value })}
                  placeholder="e.g., Nursery - KG"
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
                <Label htmlFor="image_url">Image URL (optional)</Label>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {programs.map((program) => (
          <div key={program.id} className="bg-card rounded-xl border border-border p-5 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(program)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => deleteMutation.mutate(program.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-3">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                {program.icon_name || "BookOpen"}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{program.title}</h3>
            {program.subtitle && (
              <p className="text-sm text-primary font-medium mb-2">{program.subtitle}</p>
            )}
            {program.grade_range && (
              <p className="text-xs text-muted-foreground mb-2">Grades: {program.grade_range}</p>
            )}
            {program.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <Switch
                checked={program.is_active}
                onCheckedChange={(checked) => toggleMutation.mutate({ id: program.id, is_active: checked })}
              />
              <span className="text-xs text-muted-foreground">
                {program.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
        {programs.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No academic programs yet. Add your first program.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
