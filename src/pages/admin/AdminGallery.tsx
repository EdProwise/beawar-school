import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/admin/FileUpload";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const AdminGallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  const { data: existingCategories = [] } = useQuery({
    queryKey: ["gallery-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("category")
        .order("category");
      if (error) return [];
      const unique = Array.from(new Set(data.map(i => i.category)));
      return unique;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Deleted", description: "Gallery item deleted successfully" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("gallery_items")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
  });

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Gallery</h1>
            <p className="text-muted-foreground">Manage photo gallery items</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
            No gallery items yet. Click "Add Image" to create one.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this image?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/20 hover:bg-destructive text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                    </div>
                    <button
                      onClick={() => togglePublishMutation.mutate({ id: item.id, is_published: !item.is_published })}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        item.is_published
                          ? "text-green-600 hover:bg-green-50"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <GalleryModal
          item={editingItem}
          categories={existingCategories}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
            queryClient.invalidateQueries({ queryKey: ["gallery-categories"] });
          }}
        />
      )}
    </AdminLayout>
  );
};

interface GalleryModalProps {
  item: GalleryItem | null;
  categories: string[];
  onClose: () => void;
  onSuccess: () => void;
}

function GalleryModal({ item, categories, onClose, onSuccess }: GalleryModalProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    category: item?.category || "campus",
    image_url: item?.image_url || "",
    description: item?.description || "",
    sort_order: item?.sort_order || 0,
    is_published: item?.is_published ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (item) {
        const { error } = await supabase.from("gallery_items").update(formData).eq("id", item.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Gallery item updated successfully" });
      } else {
        const { error } = await supabase.from("gallery_items").insert([formData]);
        if (error) throw error;
        toast({ title: "Created", description: "Gallery item created successfully" });
      }
      onSuccess();
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-strong w-full max-w-md">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {item ? "Edit Image" : "Add Image"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              required
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                list="category-suggestions"
                placeholder="Select or type a category"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
                required
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
                {!categories.includes("campus") && <option value="campus" />}
                {!categories.includes("events") && <option value="events" />}
                {!categories.includes("sports") && <option value="sports" />}
                {!categories.includes("academics") && <option value="academics" />}
                {!categories.includes("labs") && <option value="labs" />}
                {!categories.includes("arts") && <option value="arts" />}
              </datalist>
            </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Image *</label>
            <FileUpload
              accept="image"
              currentUrl={formData.image_url}
              onUpload={(url) => setFormData({ ...formData, image_url: url })}
            />
            <p className="text-xs text-muted-foreground mt-2">Or enter URL manually:</p>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none mt-1"
              placeholder="/sports.png or https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Published</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : item ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminGallery;
