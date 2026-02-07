import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Video } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FileUpload } from "@/components/admin/FileUpload";
import { supabase } from "@/integrations/mongodb/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NewsEvent {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  video_url: string | null;
  event_date: string | null;
  event_location: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

const AdminNews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsEvent | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as NewsEvent[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast({ title: "Deleted", description: "News item deleted successfully" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("news_events")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
    },
  });

  const handleEdit = (item: NewsEvent) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">News & Events</h1>
            <p className="text-muted-foreground">Manage news articles and events</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No news items yet. Click "Add New" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Title</th>
                    <th className="text-left p-4 font-medium text-foreground">Category</th>
                    <th className="text-left p-4 font-medium text-foreground">Date</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-right p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-foreground">{item.title}</p>
                              <div className="flex items-center gap-2">
                                {item.is_featured && (
                                  <span className="text-xs text-accent font-medium">Featured</span>
                                )}
                                {item.video_url && (
                                  <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                    <Video className="w-3 h-3" /> Video
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this?")) {
                                deleteMutation.mutate(item.id);
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <NewsModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-news"] });
          }}
        />
      )}
    </AdminLayout>
  );
};

interface NewsModalProps {
  item: NewsEvent | null;
  onClose: () => void;
  onSuccess: () => void;
}

function NewsModal({ item, onClose, onSuccess }: NewsModalProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    slug: item?.slug || "",
    excerpt: item?.excerpt || "",
    content: item?.content || "",
    category: item?.category || "announcement",
    image_url: item?.image_url || "",
    video_url: item?.video_url || "",
    event_date: item?.event_date?.split("T")[0] || "",
    event_location: item?.event_location || "",
    is_featured: item?.is_featured || false,
    is_published: item?.is_published ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        category: formData.category,
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        event_date: formData.event_date || null,
        event_location: formData.event_location || null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
      };

      if (item) {
        const { error } = await supabase.from("news_events").update(payload).eq("id", item.id);
        if (error) throw error;
        toast({ title: "Updated", description: "News item updated successfully" });
      } else {
        const { error } = await supabase.from("news_events").insert([payload]);
        if (error) throw error;
        toast({ title: "Created", description: "News item created successfully" });
      }
      onSuccess();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {item ? "Edit News" : "Add News"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-foreground mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
                required
              />
            </div>
          </div>
            <div>
              <RichTextEditor
                label="Excerpt"
                value={formData.excerpt}
                onChange={(content) => setFormData({ ...formData, excerpt: content })}
              />
            </div>
            <div>
              <RichTextEditor
                label="Content"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content: content })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
                >
                  <option value="announcement">Announcement</option>
                  <option value="achievement">Achievement</option>
                  <option value="event">Event</option>
                  <option value="notice">Notice</option>
                </select>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Featured Image</label>
                <FileUpload
                  accept="image"
                  currentUrl={formData.image_url}
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Video (Optional)</label>
                <FileUpload
                  accept="video"
                  currentUrl={formData.video_url}
                  onUpload={(url) => setFormData({ ...formData, video_url: url })}
                />
              </div>
            </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Event Date</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Event Location</label>
              <input
                type="text"
                name="event_location"
                value={formData.event_location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm text-foreground">Featured</span>
            </label>
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

export default AdminNews;
