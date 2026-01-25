import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Palette } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

// Preset color themes
const colorPresets = [
  { name: "Purple", primary: "#4C0DC9", accent: "#d4a853" },
  { name: "Royal Blue", primary: "#1e40af", accent: "#d4a853" },
  { name: "Emerald", primary: "#047857", accent: "#f59e0b" },
  { name: "Rose", primary: "#be123c", accent: "#facc15" },
  { name: "Indigo", primary: "#4338ca", accent: "#f97316" },
  { name: "Teal", primary: "#0d9488", accent: "#eab308" },
  { name: "Slate", primary: "#334155", accent: "#3b82f6" },
  { name: "Orange", primary: "#c2410c", accent: "#0ea5e9" },
];

export default function AdminSettings() {
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
    school_name: "",
    tagline: "",
    logo_url: "",
    email: "",
    phone: "",
    phone_secondary: "",
    address: "",
    map_embed_url: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    youtube_url: "",
    whatsapp_number: "",
    footer_text: "",
    primary_color: "#4C0DC9",
    accent_color: "#d4a853",
    cta_primary_text: "Apply Now",
    cta_primary_link: "/admissions",
    cta_secondary_text: "Portal",
    cta_secondary_link: "/students",
    office_hours_weekday: "Mon - Fri: 8:00 AM - 5:00 PM",
    office_hours_weekend: "Sat: 9:00 AM - 1:00 PM",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        school_name: settings.school_name || "",
        tagline: settings.tagline || "",
        logo_url: settings.logo_url || "",
        email: settings.email || "",
        phone: settings.phone || "",
        phone_secondary: settings.phone_secondary || "",
        address: settings.address || "",
        map_embed_url: settings.map_embed_url || "",
        facebook_url: settings.facebook_url || "",
        twitter_url: settings.twitter_url || "",
        instagram_url: settings.instagram_url || "",
        youtube_url: settings.youtube_url || "",
        whatsapp_number: settings.whatsapp_number || "",
        footer_text: settings.footer_text || "",
        primary_color: settings.primary_color || "#4C0DC9",
        accent_color: settings.accent_color || "#d4a853",
        cta_primary_text: settings.cta_primary_text || "Apply Now",
        cta_primary_link: settings.cta_primary_link || "/admissions",
        cta_secondary_text: settings.cta_secondary_text || "Portal",
        cta_secondary_link: settings.cta_secondary_link || "/students",
        office_hours_weekday: settings.office_hours_weekday || "Mon - Fri: 8:00 AM - 5:00 PM",
        office_hours_weekend: settings.office_hours_weekend || "Sat: 9:00 AM - 1:00 PM",
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
      toast({ title: "Settings saved successfully! Refresh the page to see color changes." });
    },
    onError: () => {
      toast({ title: "Error saving settings", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setFormData({
      ...formData,
      primary_color: preset.primary,
      accent_color: preset.accent,
    });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground">Manage your school's global settings and branding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Color Theme */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Color Theme</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Customize the website colors to match your school's branding
            </p>
            
            {/* Preset Colors */}
            <div className="mb-6">
              <Label className="mb-3 block">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: preset.accent }}
                    />
                    <span className="text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-3 mt-2">
                  <input
                    type="color"
                    id="primary_color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-14 h-10 rounded cursor-pointer border-0"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#4C0DC9"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Used for buttons, links, headers</p>
              </div>
              <div>
                <Label htmlFor="accent_color">Accent Color (Gold)</Label>
                <div className="flex gap-3 mt-2">
                  <input
                    type="color"
                    id="accent_color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-14 h-10 rounded cursor-pointer border-0"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    placeholder="#d4a853"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Used for highlights and CTAs</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 rounded-lg border border-border bg-secondary/30">
              <Label className="mb-3 block text-sm">Preview</Label>
              <div className="flex items-center gap-4">
                <div 
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  Primary Button
                </div>
                <div 
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: formData.accent_color, color: '#1a1a1a' }}
                >
                  Accent Button
                </div>
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: formData.primary_color }}
                />
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: formData.accent_color }}
                />
              </div>
            </div>
          </div>

          {/* Header CTA Buttons */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Header Buttons</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Customize the buttons that appear in the website header
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="font-medium text-foreground">Primary Button (Gold)</h3>
                <div>
                  <Label htmlFor="cta_primary_text">Button Text</Label>
                  <Input
                    id="cta_primary_text"
                    value={formData.cta_primary_text}
                    onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
                    placeholder="Apply Now"
                  />
                </div>
                <div>
                  <Label htmlFor="cta_primary_link">Button Link</Label>
                  <Input
                    id="cta_primary_link"
                    value={formData.cta_primary_link}
                    onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                    placeholder="/admissions"
                  />
                </div>
              </div>
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="font-medium text-foreground">Secondary Button (Portal)</h3>
                <div>
                  <Label htmlFor="cta_secondary_text">Button Text</Label>
                  <Input
                    id="cta_secondary_text"
                    value={formData.cta_secondary_text}
                    onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                    placeholder="Portal"
                  />
                </div>
                <div>
                  <Label htmlFor="cta_secondary_link">Button Link</Label>
                  <Input
                    id="cta_secondary_link"
                    value={formData.cta_secondary_link}
                    onChange={(e) => setFormData({ ...formData, cta_secondary_link: e.target.value })}
                    placeholder="/students"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* General Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="school_name">School Name *</Label>
                <Input
                  id="school_name"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Excellence in Education"
                />
              </div>
              <div className="md:col-span-2">
                <Label>School Logo</Label>
                <FileUpload
                  accept="image"
                  currentUrl={formData.logo_url}
                  onUpload={(url) => setFormData({ ...formData, logo_url: url })}
                />
                <p className="text-xs text-muted-foreground mt-2">Or enter URL manually:</p>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="footer_text">Footer Description</Label>
                <Textarea
                  id="footer_text"
                  value={formData.footer_text}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone_secondary">Secondary Phone</Label>
                <Input
                  id="phone_secondary"
                  value={formData.phone_secondary}
                  onChange={(e) => setFormData({ ...formData, phone_secondary: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="map_embed_url">Google Maps Embed URL</Label>
                <Input
                  id="map_embed_url"
                  value={formData.map_embed_url}
                  onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
              <div>
                <Label htmlFor="office_hours_weekday">Office Hours (Weekday)</Label>
                <Input
                  id="office_hours_weekday"
                  value={formData.office_hours_weekday}
                  onChange={(e) => setFormData({ ...formData, office_hours_weekday: e.target.value })}
                  placeholder="Mon - Fri: 8:00 AM - 5:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="office_hours_weekend">Office Hours (Weekend)</Label>
                <Input
                  id="office_hours_weekend"
                  value={formData.office_hours_weekend}
                  onChange={(e) => setFormData({ ...formData, office_hours_weekend: e.target.value })}
                  placeholder="Sat: 9:00 AM - 1:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/yourschool"
                />
              </div>
              <div>
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/yourschool"
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/yourschool"
                />
              </div>
              <div>
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/c/yourschool"
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
