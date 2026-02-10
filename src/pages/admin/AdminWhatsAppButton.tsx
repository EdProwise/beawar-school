import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, MessageCircle } from "lucide-react";

export default function AdminWhatsAppButton() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    whatsapp_button_enabled: true,
    whatsapp_button_script_url: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsapp_button_enabled: settings.whatsapp_button_enabled !== false,
        whatsapp_button_script_url: settings.whatsapp_button_script_url || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (settings?.id) {
        const { error } = await supabase
          .from("site_settings")
          .update(data)
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "WhatsApp Button settings saved!" });
    },
    onError: () => {
      toast({ title: "Error saving settings", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
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
      <div className="max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">WhatsApp Button</h1>
            <p className="text-muted-foreground">Configure the floating WhatsApp chat button on your website</p>
          </div>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">WhatsApp Chat Button Settings</h2>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="whatsapp_button_enabled" className="text-base font-medium">Enable WhatsApp Button</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Show a floating WhatsApp chat button on your website
                </p>
              </div>
              <Switch
                id="whatsapp_button_enabled"
                checked={formData.whatsapp_button_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, whatsapp_button_enabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_button_script_url">WhatsApp Button Script URL</Label>
              <Input
                id="whatsapp_button_script_url"
                value={formData.whatsapp_button_script_url}
                onChange={(e) => setFormData({ ...formData, whatsapp_button_script_url: e.target.value })}
                placeholder="https://edprowisebooster.edprowise.com/api/whatsapp-button/script?id=25"
              />
              <p className="text-xs text-muted-foreground">
                Enter the external script URL provided by your WhatsApp button service (e.g., EdProwise Booster).
              </p>
            </div>

            {formData.whatsapp_button_script_url && (
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-foreground mb-1">Current Script URL:</p>
                <code className="text-xs text-muted-foreground break-all">{formData.whatsapp_button_script_url}</code>
              </div>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
