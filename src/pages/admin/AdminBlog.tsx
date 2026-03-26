import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FileUpload } from "@/components/admin/FileUpload";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Save, Star,
  PenLine, Palette, BookOpen, X, Tag, User, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  author_name: string | null;
  author_avatar: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  read_time: number | null;
  created_at: string;
}

interface BlogSettings {
  id?: string;
  page_heading: string;
  page_subheading: string;
  card_style: "classic" | "modern" | "minimal";
  show_author: boolean;
  show_date: boolean;
  show_read_time: boolean;
  show_tags: boolean;
  posts_per_page: number;
}

const emptyPost = (): Omit<BlogPost, "id" | "created_at"> => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  author_name: "",
  author_avatar: "",
  cover_image_url: "",
  is_published: true,
  is_featured: false,
  read_time: null,
});

const defaultSettings: BlogSettings = {
  page_heading: "Our Blog",
  page_subheading: "Insights, stories, and updates from our school community.",
  card_style: "modern",
  show_author: true,
  show_date: true,
  show_read_time: true,
  show_tags: true,
  posts_per_page: 9,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminBlog() {
  const [activeTab, setActiveTab] = useState<"posts" | "style">("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyPost());
  const [tagInput, setTagInput] = useState("");
  const [settingsForm, setSettingsForm] = useState<BlogSettings>(defaultSettings);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as BlogPost[]) ?? [];
    },
  });

  const { data: settingsRecord } = useQuery({
    queryKey: ["admin-blog-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as (BlogSettings & { id: string }) | null;
    },
  });

  useEffect(() => {
    if (settingsRecord) {
      setSettingsForm({
        page_heading: settingsRecord.page_heading || defaultSettings.page_heading,
        page_subheading: settingsRecord.page_subheading || defaultSettings.page_subheading,
        card_style: settingsRecord.card_style || defaultSettings.card_style,
        show_author: settingsRecord.show_author ?? true,
        show_date: settingsRecord.show_date ?? true,
        show_read_time: settingsRecord.show_read_time ?? true,
        show_tags: settingsRecord.show_tags ?? true,
        posts_per_page: settingsRecord.posts_per_page || 9,
      });
    }
  }, [settingsRecord]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const payload = {
        ...data,
        cover_image_url: data.cover_image_url || null,
        author_avatar: data.author_avatar || null,
        excerpt: data.excerpt || null,
        content: data.content || null,
        category: data.category || null,
        tags: data.tags?.filter(Boolean) || [],
        slug: data.slug || slugify(data.title),
      };
      if (editingPost?.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", editingPost.id);
        if (error) throw error;
      } else {
        const id = `blog_${Date.now()}`;
        const { error } = await supabase
          .from("blog_posts")
          .insert([{ id, ...payload }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Saved successfully!" });
      setIsModalOpen(false);
      setEditingPost(null);
      setForm(emptyPost());
    },
    onError: (e: any) => toast({ title: "Error saving post", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Post deleted" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] }),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({ is_featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] }),
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: BlogSettings) => {
      const payload = { ...data, updated_at: new Date().toISOString() };
      if (settingsRecord?.id) {
        const { error } = await supabase.from("blog_settings").update(payload).eq("id", settingsRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_settings").insert([{ id: `bset_${Date.now()}`, ...payload }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-settings"] });
      queryClient.invalidateQueries({ queryKey: ["blog-settings"] });
      toast({ title: "Blog settings saved!" });
    },
    onError: (e: any) => toast({ title: "Error saving settings", description: e.message, variant: "destructive" }),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenNew = () => {
    setEditingPost(null);
    setForm(emptyPost());
    setTagInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "",
      tags: post.tags || [],
      author_name: post.author_name || "",
      author_avatar: post.author_avatar || "",
      cover_image_url: post.cover_image_url || "",
      is_published: post.is_published,
      is_featured: post.is_featured,
      read_time: post.read_time,
    });
    setTagInput("");
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags?.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) || [] }));
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug && prev.slug !== slugify(prev.title) ? prev.slug : slugify(title),
    }));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="max-w-6xl pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <PenLine className="w-8 h-8 text-primary" /> Blog Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage blog posts and page style settings</p>
          </div>
          {activeTab === "posts" && (
            <Button onClick={handleOpenNew} className="gap-2">
              <Plus className="w-4 h-4" /> New Post
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted p-1 rounded-xl w-fit">
          {(["posts", "style"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2",
                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "posts" ? <BookOpen className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
              {tab === "posts" ? "Posts" : "Blog Style"}
            </button>
          ))}
        </div>

        {/* ── Posts Tab ────────────────────────────────────────────────────── */}
        {activeTab === "posts" && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-24 bg-card border border-dashed border-border rounded-2xl">
                <PenLine className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-6">Create your first post to get started.</p>
                <Button onClick={handleOpenNew}><Plus className="w-4 h-4 mr-2" /> New Post</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                        {post.is_featured && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">Featured</span>
                        )}
                        {!post.is_published && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase">Draft</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        {post.category && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{post.category}</span>}
                        <span>{formatDate(post.created_at)}</span>
                        {post.read_time && <span>{post.read_time} min read</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleFeaturedMutation.mutate({ id: post.id, is_featured: !post.is_featured })}
                        title={post.is_featured ? "Unfeature" : "Feature"}
                        className={cn("p-2 rounded-xl transition-colors", post.is_featured ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:bg-muted")}
                      >
                        <Star className={cn("w-4 h-4", post.is_featured && "fill-amber-500")} />
                      </button>
                      <button
                        onClick={() => togglePublishMutation.mutate({ id: post.id, is_published: !post.is_published })}
                        title={post.is_published ? "Unpublish" : "Publish"}
                        className={cn("p-2 rounded-xl transition-colors", post.is_published ? "text-green-600 bg-green-50" : "text-muted-foreground hover:bg-muted")}
                      >
                        {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(post.id); }}
                        className="p-2 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Style Tab ────────────────────────────────────────────────────── */}
        {activeTab === "style" && (
          <form
            onSubmit={e => { e.preventDefault(); saveSettingsMutation.mutate(settingsForm); }}
            className="space-y-6"
          >
            {/* Page Heading */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <PenLine className="w-4 h-4 text-primary" /> Page Content
              </h2>
              <div>
                <Label>Page Heading</Label>
                <Input
                  value={settingsForm.page_heading}
                  onChange={e => setSettingsForm(p => ({ ...p, page_heading: e.target.value }))}
                  placeholder="Our Blog"
                />
              </div>
              <div>
                <Label>Page Sub-heading</Label>
                <Input
                  value={settingsForm.page_subheading}
                  onChange={e => setSettingsForm(p => ({ ...p, page_subheading: e.target.value }))}
                  placeholder="Insights, stories and updates..."
                />
              </div>
            </div>

            {/* Card Style */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-primary" /> Card Style
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {(["modern", "classic", "minimal"] as const).map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSettingsForm(p => ({ ...p, card_style: style }))}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-semibold capitalize",
                      settingsForm.card_style === style
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-full h-16 rounded-lg",
                      style === "modern" && "bg-gradient-to-br from-primary/20 to-accent/10",
                      style === "classic" && "bg-gradient-to-br from-gray-200 to-gray-100 border border-gray-200",
                      style === "minimal" && "border-2 border-dashed border-gray-200"
                    )} />
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-primary" /> Display Options
              </h2>
              {([
                { key: "show_author", label: "Show Author Name" },
                { key: "show_date", label: "Show Published Date" },
                { key: "show_read_time", label: "Show Read Time" },
                { key: "show_tags", label: "Show Tags" },
              ] as { key: keyof BlogSettings; label: string }[]).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="cursor-pointer">{label}</Label>
                  <Switch
                    checked={!!settingsForm[key]}
                    onCheckedChange={v => setSettingsForm(p => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
              <div>
                <Label>Posts Per Page</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={settingsForm.posts_per_page}
                  onChange={e => setSettingsForm(p => ({ ...p, posts_per_page: parseInt(e.target.value) || 9 }))}
                  className="w-28 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saveSettingsMutation.isPending} className="px-8">
                {saveSettingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Settings
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* ── Post Modal ─────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-3xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" />
                {editingPost ? "Edit Post" : "New Blog Post"}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); setEditingPost(null); setForm(emptyPost()); }}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => { e.preventDefault(); saveMutation.mutate(form); }}
              className="p-6 space-y-5"
            >
              {/* Title */}
              <div>
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Post title"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: slugify(e.target.value) }))}
                  placeholder="post-url-slug"
                />
                <p className="text-xs text-muted-foreground mt-1">Will be auto-generated from title if left empty.</p>
              </div>

              {/* Category & Author row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={form.category || ""}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Academics, Events"
                  />
                </div>
                <div>
                  <Label>Author Name</Label>
                  <Input
                    value={form.author_name || ""}
                    onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
                    placeholder="e.g. Mr. Sharma"
                  />
                </div>
              </div>

              {/* Read Time */}
              <div>
                <Label>Read Time (minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.read_time || ""}
                  onChange={e => setForm(p => ({ ...p, read_time: parseInt(e.target.value) || null }))}
                  placeholder="e.g. 5"
                  className="w-32"
                />
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add tag and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag} size="sm">Add</Button>
                </div>
                {form.tags && form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-medium">
                        <Tag className="w-3 h-3" /> {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <Label>Cover Image</Label>
                <FileUpload
                  accept="image"
                  currentUrl={form.cover_image_url || ""}
                  onUpload={url => setForm(p => ({ ...p, cover_image_url: url }))}
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label>Excerpt (Short Summary)</Label>
                <textarea
                  value={form.excerpt || ""}
                  onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                  rows={3}
                  placeholder="Brief summary shown in the listing..."
                  className="w-full mt-1 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              {/* Content */}
              <div>
                <RichTextEditor
                  label="Content"
                  value={form.content || ""}
                  onChange={val => setForm(p => ({ ...p, content: val }))}
                  placeholder="Write your blog post here..."
                />
              </div>

              {/* Toggles */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl border",
                  form.is_published ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}>
                  <div>
                    <p className="text-sm font-semibold">{form.is_published ? "Published" : "Draft"}</p>
                    <p className="text-xs text-muted-foreground">Visible on website</p>
                  </div>
                  <Switch
                    checked={form.is_published}
                    onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))}
                  />
                </div>
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl border",
                  form.is_featured ? "bg-amber-50 border-amber-200" : "bg-muted border-border"
                )}>
                  <div>
                    <p className="text-sm font-semibold">{form.is_featured ? "Featured" : "Not Featured"}</p>
                    <p className="text-xs text-muted-foreground">Show as hero post</p>
                  </div>
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsModalOpen(false); setEditingPost(null); setForm(emptyPost()); }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {editingPost ? "Update Post" : "Publish Post"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
