import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/mongodb/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_image: string | null;
  rating: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const AdminTestimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast({ title: "Deleted", description: "Testimonial deleted successfully" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
  });

  const handleEdit = (item: Testimonial) => {
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
            <h1 className="font-heading text-2xl font-bold text-foreground">Testimonials</h1>
            <p className="text-muted-foreground">Manage parent and student testimonials</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
            No testimonials yet. Click "Add Testimonial" to create one.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-6 relative"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {item.author_image ? (
                      <img
                        src={item.author_image}
                        alt={item.author_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {item.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{item.author_name}</p>
                      <p className="text-sm text-muted-foreground">{item.author_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm italic mb-4">"{item.quote}"</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => togglePublishMutation.mutate({ id: item.id, is_published: !item.is_published })}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
                      item.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {item.is_published ? (
                      <>
                        <Eye className="w-3 h-3" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Draft
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this testimonial?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <TestimonialModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
          }}
        />
      )}
    </AdminLayout>
  );
};

interface TestimonialModalProps {
  item: Testimonial | null;
  onClose: () => void;
  onSuccess: () => void;
}

function TestimonialModal({ item, onClose, onSuccess }: TestimonialModalProps) {
  const [formData, setFormData] = useState({
    quote: item?.quote || "",
    author_name: item?.author_name || "",
    author_role: item?.author_role || "",
    author_image: item?.author_image || "",
    rating: item?.rating || 5,
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
      const payload = {
        ...formData,
        author_image: formData.author_image || null,
      };

      if (item) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", item.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Testimonial updated successfully" });
      } else {
        const { error } = await supabase.from("testimonials").insert([payload]);
        if (error) throw error;
        toast({ title: "Created", description: "Testimonial created successfully" });
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
      <div className="relative bg-card rounded-2xl shadow-strong w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {item ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quote *</label>
            <textarea
              name="quote"
              value={formData.quote}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Author Name *</label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Author Role *</label>
            <input
              type="text"
              name="author_role"
              value={formData.author_role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              placeholder="e.g., Parent of Grade 5 Student"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Author Image URL</label>
            <input
              type="url"
              name="author_image"
              value={formData.author_image}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min={1}
                max={5}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
            </div>
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
          </div>
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

export default AdminTestimonials;
