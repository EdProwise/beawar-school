import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/admin/FileUpload";
import {
  Loader2,
  Save,
  Megaphone,
  Image,
  Video,
  Type,
  Link as LinkIcon,
  Eye,
  EyeOff,
  ClipboardList,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
} from "lucide-react";

type PopupContentType = "image" | "video" | "text" | "link" | "contact_form";

interface PopupConfig {
  id?: string;
  enabled: boolean;
  content_type: PopupContentType;
  title: string;
  body_text: string;
  image_url: string;
  video_url: string;
  link_url: string;
  link_label: string;
  delay_seconds: number;
  gap_seconds: number;
  sort_order: number;
  show_once: boolean;
  form_heading: string;
  form_subheading: string;
  form_use_external: boolean;
  form_image_url: string;
}

const defaultConfig: PopupConfig = {
  enabled: false,
  content_type: "image",
  title: "",
  body_text: "",
  image_url: "",
  video_url: "",
  link_url: "",
  link_label: "Learn More",
  delay_seconds: 2,
  gap_seconds: 5,
  sort_order: 0,
  show_once: true,
  form_heading: "Get in Touch",
  form_subheading: "Fill in the form and we will get back to you shortly.",
  form_use_external: false,
  form_image_url: "",
};

const contentTypes: { value: PopupContentType; label: string; icon: any }[] = [
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "text", label: "Text", icon: Type },
  { value: "link", label: "Link / URL", icon: LinkIcon },
  { value: "contact_form", label: "Contact Form", icon: ClipboardList },
];

export default function AdminPopup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPopupId, setSelectedPopupId] = useState<string | null>(null);
  const [form, setForm] = useState<PopupConfig>(defaultConfig);

  const { data: popups, isLoading } = useQuery({
    queryKey: ["admin-popups-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_config")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as PopupConfig[];
    },
  });

  useEffect(() => {
    if (popups && popups.length > 0) {
      if (!selectedPopupId) {
        setSelectedPopupId(popups[0].id || null);
        setForm(popups[0]);
      } else if (selectedPopupId !== "new") {
        const selected = popups.find((p) => p.id === selectedPopupId);
        if (selected) {
          setForm(selected);
        }
      }
    } else if (popups && popups.length === 0 && selectedPopupId !== "new") {
      setForm(defaultConfig);
      setSelectedPopupId(null);
    }
  }, [popups, selectedPopupId]);

  const saveMutation = useMutation({
    mutationFn: async (payload: PopupConfig) => {
      const { id, ...rest } = payload;
      if (id && id !== "new") {
        const { error } = await supabase
          .from("popup_config")
          .update(rest)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("popup_config")
          .insert([rest])
          .select()
          .single();
        if (error) throw error;
        setSelectedPopupId(data.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-popups-list"] });
      queryClient.invalidateQueries({ queryKey: ["popup-config"] });
      toast({ title: "Popup settings saved!" });
    },
    onError: () => {
      toast({ title: "Error saving popup settings", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("popup_config").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-popups-list"] });
      toast({ title: "Popup deleted" });
      setSelectedPopupId(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      if (!popups) return;
      const index = popups.findIndex((p) => p.id === id);
      if (direction === "up" && index === 0) return;
      if (direction === "down" && index === popups.length - 1) return;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      const current = popups[index];
      const target = popups[targetIndex];

      await supabase
        .from("popup_config")
        .update({ sort_order: target.sort_order })
        .eq("id", current.id);
      await supabase
        .from("popup_config")
        .update({ sort_order: current.sort_order })
        .eq("id", target.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-popups-list"] });
    },
  });

  const addNew = () => {
    const nextOrder = popups ? (popups.length > 0 ? Math.max(...popups.map(p => p.sort_order || 0)) + 1 : 0) : 0;
    const newPopup = { ...defaultConfig, sort_order: nextOrder, title: "New Popup" };
    setForm(newPopup);
    setSelectedPopupId("new");
  };

  const set = (field: keyof PopupConfig, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const LinkSection = (
    <div className="space-y-3 pt-4 border-t border-border">
      <p className="text-sm font-medium text-foreground">
        Link / Button <span className="text-muted-foreground font-normal">(optional)</span>
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>URL</Label>
          <Input
            value={form.link_url}
            onChange={(e) => set("link_url", e.target.value)}
            placeholder="https://... or /admissions"
          />
        </div>
        <div className="space-y-2">
          <Label>Button Label</Label>
          <Input
            value={form.link_label}
            onChange={(e) => set("link_label", e.target.value)}
            placeholder="Learn More"
          />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Popups List */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Popups</h2>
              <Button 
                size="sm" 
                onClick={addNew}
                disabled={selectedPopupId === "new"}
              >
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {selectedPopupId === "new" && (
                <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-primary animate-pulse">
                      * New Popup
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {form.content_type.replace("_", " ")}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}

              {popups?.map((p, idx) => (
                <div
                  key={p.id}
                  className={`group relative flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedPopupId === p.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 bg-card"
                  }`}
                  onClick={() => {
                    setSelectedPopupId(p.id!);
                    setForm(p);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {p.title || `Popup ${idx + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {p.content_type.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderMutation.mutate({ id: p.id!, direction: "up" });
                      }}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderMutation.mutate({ id: p.id!, direction: "down" });
                      }}
                      disabled={idx === (popups?.length || 0) - 1}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {p.enabled ? (
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted" />
                  )}
                </div>
              ))}
              {(!popups || popups.length === 0) && selectedPopupId !== "new" && (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-border text-muted-foreground">
                  No popups configured yet. Click "Add" to create one.
                </div>
              )}
            </div>
          </div>

          {/* Right: Form Editor */}
          <div className="flex-1 max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {selectedPopupId === "new" ? "New Popup" : !selectedPopupId ? "Homepage Popup" : "Edit Popup"}
                </h1>
                <p className="text-muted-foreground">
                  {selectedPopupId === "new" 
                    ? "Fill in the details below to create your new popup." 
                    : !selectedPopupId 
                    ? "Add your first popup to get started."
                    : "Configure the content and behaviour for this popup."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedPopupId === "new" ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (popups && popups.length > 0) {
                        setSelectedPopupId(popups[0].id!);
                        setForm(popups[0]);
                      } else {
                        setSelectedPopupId(null);
                        setForm(defaultConfig);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                ) : (
                  selectedPopupId && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this popup?")) {
                          deleteMutation.mutate(selectedPopupId!);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )
                )}
              <Button
                onClick={() => saveMutation.mutate(form)}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>

          {/* Enable / Disable */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Popup Status</p>
                  <p className="text-sm text-muted-foreground">
                    {form.enabled ? "This popup is active" : "This popup is inactive"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {form.enabled ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                <Switch
                  checked={form.enabled}
                  onCheckedChange={(v) => set("enabled", v)}
                />
              </div>
            </div>
          </div>

          {/* Content Type */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Content Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {contentTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("content_type", value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    form.content_type === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40 text-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="font-semibold text-foreground">Popup Content</h2>

            {/* Title */}
            <div className="space-y-2">
              <Label>
                Popup Title
              </Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Admissions Open 2025-26"
              />
            </div>

            {/* ── IMAGE ──────────────────────────────────────────────────────── */}
            {form.content_type === "image" && (
              <>
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <FileUpload
                    accept="image"
                    currentUrl={form.image_url}
                    onUpload={(url) => set("image_url", url)}
                  />
                  <p className="text-xs text-muted-foreground">Or enter image URL:</p>
                  <Input
                    value={form.image_url}
                    onChange={(e) => set("image_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                {LinkSection}
              </>
            )}

            {/* ── VIDEO ──────────────────────────────────────────────────────── */}
            {form.content_type === "video" && (
              <>
                <div className="space-y-2">
                  <Label>Upload Video</Label>
                  <FileUpload
                    accept="video"
                    currentUrl={form.video_url}
                    onUpload={(url) => set("video_url", url)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Or enter video URL (YouTube / direct MP4):
                  </p>
                  <Input
                    value={form.video_url}
                    onChange={(e) => set("video_url", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or /uploads/video.mp4"
                  />
                </div>
                {LinkSection}
              </>
            )}

            {/* ── TEXT ───────────────────────────────────────────────────────── */}
            {form.content_type === "text" && (
              <>
                <div className="space-y-2">
                  <Label>Message / Body Text</Label>
                  <Textarea
                    value={form.body_text}
                    onChange={(e) => set("body_text", e.target.value)}
                    rows={5}
                    placeholder="Enter the announcement or message to display..."
                  />
                </div>
                {LinkSection}
              </>
            )}

            {/* ── CONTACT FORM ──────────────────────────────────────────────── */}
            {form.content_type === "contact_form" && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary font-medium">
                  A beautiful split-panel contact form will be shown. Left panel displays an image, right panel shows the form. Submissions go to your Admissions / Contacts list.
                </div>

                <div className="space-y-2">
                  <Label>Form Heading</Label>
                  <Input
                    value={form.form_heading}
                    onChange={(e) => set("form_heading", e.target.value)}
                    placeholder="Get in Touch"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sub-heading / Description</Label>
                  <Textarea
                    value={form.form_subheading}
                    onChange={(e) => set("form_subheading", e.target.value)}
                    rows={2}
                    placeholder="Fill in the form and we will get back to you shortly."
                  />
                </div>

                {/* Left panel image */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label>Left Panel Image <span className="text-muted-foreground font-normal">(square panel — recommended 600×600px)</span></Label>
                  <FileUpload
                    accept="image"
                    currentUrl={form.form_image_url}
                    onUpload={(url) => set("form_image_url", url)}
                  />
                  <Input
                    value={form.form_image_url}
                    onChange={(e) => set("form_image_url", e.target.value)}
                    placeholder="https://... or /uploads/..."
                  />
                  <p className="text-xs text-muted-foreground">This image fills the left side of the popup. If empty, a gradient panel is shown instead.</p>
                </div>

                {/* External Form Toggle */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Use External Form</p>
                      <p className="text-xs text-muted-foreground">
                        Display the embedded form from Admission Process page instead of the built-in form.
                      </p>
                    </div>
                    <Switch
                      checked={form.form_use_external}
                      onCheckedChange={(v) => set("form_use_external", v)}
                    />
                  </div>
                  {form.form_use_external && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                      The external form HTML set in <strong>Admin &gt; Admissions &gt; Settings &gt; Inquiry Form</strong> will be shown inside the popup. Make sure &ldquo;Use Custom Inquiry HTML&rdquo; is enabled there.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── LINK / URL ─────────────────────────────────────────────────── */}
            {form.content_type === "link" && (
              <div className="space-y-5">
                {/* Body text */}
                <div className="space-y-2">
                  <Label>Body Text <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={form.body_text}
                    onChange={(e) => set("body_text", e.target.value)}
                    rows={3}
                    placeholder="Short description shown above the link button..."
                  />
                </div>

                {/* Optional image */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground">
                    Image <span className="text-muted-foreground font-normal">(optional)</span>
                  </p>
                  <FileUpload
                    accept="image"
                    currentUrl={form.image_url}
                    onUpload={(url) => set("image_url", url)}
                  />
                  <Input
                    value={form.image_url}
                    onChange={(e) => set("image_url", e.target.value)}
                    placeholder="https://... (image URL)"
                  />
                </div>

                {/* Optional video */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground">
                    Video <span className="text-muted-foreground font-normal">(optional)</span>
                  </p>
                  <FileUpload
                    accept="video"
                    currentUrl={form.video_url}
                    onUpload={(url) => set("video_url", url)}
                  />
                  <Input
                    value={form.video_url}
                    onChange={(e) => set("video_url", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or /uploads/video.mp4"
                  />
                </div>

                {/* Link button */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground">Link Button</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        value={form.link_url}
                        onChange={(e) => set("link_url", e.target.value)}
                        placeholder="https://... or /admissions"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Label</Label>
                      <Input
                        value={form.link_label}
                        onChange={(e) => set("link_label", e.target.value)}
                        placeholder="Learn More"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Behaviour */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Timing & Behaviour
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="delay">Initial Delay (seconds)</Label>
                <Input
                  id="delay"
                  type="number"
                  min={0}
                  max={30}
                  value={form.delay_seconds}
                  onChange={(e) => set("delay_seconds", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Delay before this specific popup appears.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gap">Gap after previous (seconds)</Label>
                <Input
                  id="gap"
                  type="number"
                  min={0}
                  max={60}
                  value={form.gap_seconds}
                  onChange={(e) => set("gap_seconds", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Wait time after the previous popup is closed.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Show once per session</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Switch
                    checked={form.show_once}
                    onCheckedChange={(v) => set("show_once", v)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.show_once
                      ? "Shows only once per session"
                      : "Shows every page load"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
