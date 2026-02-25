import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FileUpload } from "@/components/admin/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Building2, User, MessageSquare, ShieldCheck } from "lucide-react";

export default function AdminOrbitGroupMessage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useQuery({
    queryKey: ["admin-orbit-group-message"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orbit_group_message")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    sender_name: "Orbit Group",
    sender_title: "Chairman, Orbit Group",
    sender_image_url: "",
    seal_logo_url: "",
    edprowise_logo_url: "",
    message_heading: "Message from Orbit Group",
    message_subheading: "A word from our leadership",
    message_content: "",
    signature_text: "With warm regards",
    is_published: true,
  });

  useEffect(() => {
    if (record) {
      setFormData({
        sender_name: record.sender_name || "Orbit Group",
        sender_title: record.sender_title || "Chairman, Orbit Group",
        sender_image_url: record.sender_image_url || "",
        seal_logo_url: record.seal_logo_url || "",
        edprowise_logo_url: record.edprowise_logo_url || "",
        message_heading: record.message_heading || "Message from Orbit Group",
        message_subheading: record.message_subheading || "",
        message_content: record.message_content || "",
        signature_text: record.signature_text || "With warm regards",
        is_published: record.is_published ?? true,
      });
    }
  }, [record]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        sender_image_url: data.sender_image_url || null,
        seal_logo_url: data.seal_logo_url || null,
        edprowise_logo_url: data.edprowise_logo_url || null,
        updated_at: new Date().toISOString(),
      };
      if (record?.id) {
        const { error } = await supabase
          .from("orbit_group_message")
          .update(payload)
          .eq("id", record.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("orbit_group_message")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orbit-group-message"] });
      queryClient.invalidateQueries({ queryKey: ["orbit-group-message"] });
      toast({ title: "Saved successfully!" });
    },
    onError: () => {
      toast({ title: "Error saving", variant: "destructive" });
    },
  });

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
      <div className="max-w-4xl pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Message from Orbit Group
          </h1>
          <p className="text-muted-foreground mt-1">Manage the leadership message shown on the public website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sender Details */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Sender Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sender_name">Sender Name</Label>
                <Input
                  id="sender_name"
                  value={formData.sender_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
                  placeholder="e.g., Orbit Group"
                />
              </div>
              <div>
                <Label htmlFor="sender_title">Sender Title / Designation</Label>
                <Input
                  id="sender_title"
                  value={formData.sender_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender_title: e.target.value }))}
                  placeholder="e.g., Chairman, Orbit Group"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="sender_image_url">Sender Photo URL (optional)</Label>
              <Input
                id="sender_image_url"
                value={formData.sender_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, sender_image_url: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
              />
              {formData.sender_image_url && (
                <div className="mt-3">
                  <img
                    src={formData.sender_image_url}
                    alt="Preview"
                    className="w-24 h-28 object-cover rounded-xl border border-border shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

            {/* Seal Logo */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Orbit Group Seal / Logo
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload the Orbit Group logo to display on the public page.
                Recommended: square PNG with transparent background.
              </p>
              <FileUpload
                accept="image"
                currentUrl={formData.seal_logo_url}
                onUpload={(url) => setFormData(prev => ({ ...prev, seal_logo_url: url }))}
              />
            </div>

            {/* Edprowise Logo */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Edprowise Logo
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload the Edprowise logo to display on the left side of the public page.
                Recommended: square PNG with transparent background.
              </p>
              <FileUpload
                accept="image"
                currentUrl={formData.edprowise_logo_url}
                onUpload={(url) => setFormData(prev => ({ ...prev, edprowise_logo_url: url }))}
              />
            </div>

          {/* Message Content */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Message Content
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="message_heading">Page Heading</Label>
                <Input
                  id="message_heading"
                  value={formData.message_heading}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_heading: e.target.value }))}
                  placeholder="Message from Orbit Group"
                />
              </div>
              <div>
                <Label htmlFor="message_subheading">Sub Heading (optional)</Label>
                <Input
                  id="message_subheading"
                  value={formData.message_subheading}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_subheading: e.target.value }))}
                  placeholder="A word from our leadership"
                />
              </div>
              <div>
                <RichTextEditor
                  label="Message Body"
                  value={formData.message_content}
                  onChange={(content) => setFormData(prev => ({ ...prev, message_content: content }))}
                  placeholder="Write the message here..."
                />
              </div>
              <div>
                <Label htmlFor="signature_text">Closing / Sign-off Text</Label>
                <Input
                  id="signature_text"
                  value={formData.signature_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, signature_text: e.target.value }))}
                  placeholder="e.g., With warm regards"
                />
              </div>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publish this message (visible on website)
              </Label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border mt-8 z-10">
            <Button type="submit" size="lg" className="px-12" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
