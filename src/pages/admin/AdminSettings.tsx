import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Palette, ExternalLink, Globe, Layout, Info, Phone as PhoneIcon, Share2, ShieldCheck } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    const { data: portals = [] } = useQuery({
      queryKey: ["admin-portals-list"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("portal_content")
          .select("portal_type, page_title, login_url");
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
      linkedin_url: "",
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
      tc_apply_url: "",
      tc_verify_url: "",
      affiliation_no: "",
      udise_code: "",
      lamp_color: "#4C0DC9",
    });

    const [primaryLinkType, setPrimaryLinkType] = useState<string>("preset");
    const [secondaryLinkType, setSecondaryLinkType] = useState<string>("preset");

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
            linkedin_url: settings.linkedin_url || "",
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
          tc_apply_url: settings.tc_apply_url || "",
          tc_verify_url: settings.tc_verify_url || "",
            affiliation_no: settings.affiliation_no || "",
            udise_code: settings.udise_code || "",
            lamp_color: settings.lamp_color || "#4C0DC9",
          });

        // Initialize link types based on values
        const primaryPresets = ["/admissions", "/contact", "/about"];
        const secondaryPresets = ["/students", "/teachers", "/parents", ...portals.map((p: any) => p.login_url)];
        
        setPrimaryLinkType(primaryPresets.includes(settings.cta_primary_link) ? "preset" : "custom");
        setSecondaryLinkType(secondaryPresets.includes(settings.cta_secondary_link) ? "preset" : "custom");
      }
    }, [settings, portals]);

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
      toast({ title: "Settings saved successfully!" });
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
            <p className="text-muted-foreground">Manage your school's global settings and branding</p>
          </div>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All Settings
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-muted p-1">
            <TabsTrigger value="general" className="gap-2">
              <Info className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="header" className="gap-2">
              <Layout className="w-4 h-4" />
              Header
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <PhoneIcon className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="w-4 h-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="footer" className="gap-2">
              <Globe className="w-4 h-4" />
              Footer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">General Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="school_name">School Name *</Label>
                  <Input
                    id="school_name"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Excellence in Education"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>
              
              <div className="space-y-4">
                <Label>Quick Presets</Label>
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      id="primary_color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-14 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      placeholder="#4C0DC9"
                      className="flex-1"
                    />
                  </div>
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex gap-3 mt-2">
                      <input
                        type="color"
                        id="accent_color"
                        value={formData.accent_color}
                        onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                        className="w-14 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden"
                      />
                      <Input
                        value={formData.accent_color}
                        onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                        placeholder="#d4a853"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lamp_color">Aladdin Lamp Color</Label>
                    <div className="flex gap-3 mt-2">
                      <input
                        type="color"
                        id="lamp_color"
                        value={formData.lamp_color}
                        onChange={(e) => setFormData({ ...formData, lamp_color: e.target.value })}
                        className="w-14 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden"
                      />
                      <Input
                        value={formData.lamp_color}
                        onChange={(e) => setFormData({ ...formData, lamp_color: e.target.value })}
                        placeholder="#4C0DC9"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
            </div>
          </TabsContent>

          <TabsContent value="header">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Header Buttons</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-medium text-foreground">Primary Button</h3>
                  <div className="space-y-2">
                    <Label htmlFor="cta_primary_text">Button Text</Label>
                    <Input
                      id="cta_primary_text"
                      value={formData.cta_primary_text}
                      onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
                      placeholder="Apply Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Select Primary Link</Label>
                    <Select
                      value={primaryLinkType === "custom" ? "custom" : formData.cta_primary_link}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setPrimaryLinkType("custom");
                        } else {
                          setPrimaryLinkType("preset");
                          setFormData({ ...formData, cta_primary_link: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page or enter custom link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/admissions">Admissions (/admissions)</SelectItem>
                        <SelectItem value="/contact">Contact (/contact)</SelectItem>
                        <SelectItem value="/about">About (/about)</SelectItem>
                        <SelectItem value="custom">Custom Link / HTTPS URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_primary_link">Button URL / Link</Label>
                    <div className="relative">
                      <Input
                        id="cta_primary_link"
                        value={formData.cta_primary_link}
                        onChange={(e) => {
                          setFormData({ ...formData, cta_primary_link: e.target.value });
                          if (!["/admissions", "/contact", "/about"].includes(e.target.value)) {
                            setPrimaryLinkType("custom");
                          }
                        }}
                        placeholder="https://... or /admissions"
                        className="pr-10"
                      />
                      <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-medium text-foreground">Secondary Button</h3>
                  <div className="space-y-2">
                    <Label htmlFor="cta_secondary_text">Button Text</Label>
                    <Input
                      id="cta_secondary_text"
                      value={formData.cta_secondary_text}
                      onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                      placeholder="Portal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Select Secondary Link</Label>
                    <Select
                      value={secondaryLinkType === "custom" ? "custom" : formData.cta_secondary_link}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setSecondaryLinkType("custom");
                        } else {
                          setSecondaryLinkType("preset");
                          setFormData({ ...formData, cta_secondary_link: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a portal or enter custom link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/students">Student Portal (/students)</SelectItem>
                        <SelectItem value="/teachers">Teacher Portal (/teachers)</SelectItem>
                        <SelectItem value="/parents">Parent Portal (/parents)</SelectItem>
                        {portals.map((portal: any) => (
                          portal.login_url && (
                            <SelectItem key={portal.portal_type} value={portal.login_url}>
                              External {portal.page_title} Portal
                            </SelectItem>
                          )
                        ))}
                        <SelectItem value="custom">Custom Link / HTTPS URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_secondary_link">Button URL / Link</Label>
                    <div className="relative">
                      <Input
                        id="cta_secondary_link"
                        value={formData.cta_secondary_link}
                        onChange={(e) => {
                          setFormData({ ...formData, cta_secondary_link: e.target.value });
                          const secondaryPresets = ["/students", "/teachers", "/parents", ...portals.map((p: any) => p.login_url)];
                          if (!secondaryPresets.includes(e.target.value)) {
                            setSecondaryLinkType("custom");
                          }
                        }}
                        placeholder="https://... or /portal"
                        className="pr-10"
                      />
                      <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <PhoneIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Contact Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_secondary">Secondary Phone</Label>
                  <Input
                    id="phone_secondary"
                    value={formData.phone_secondary}
                    onChange={(e) => setFormData({ ...formData, phone_secondary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                  <Input
                    id="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="map_embed_url">Google Maps Embed URL</Label>
                  <Input
                    id="map_embed_url"
                    value={formData.map_embed_url}
                    onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="office_hours_weekday">Office Hours (Weekday)</Label>
                  <Input
                    id="office_hours_weekday"
                    value={formData.office_hours_weekday}
                    onChange={(e) => setFormData({ ...formData, office_hours_weekday: e.target.value })}
                    placeholder="Mon - Fri: 8:00 AM - 5:00 PM"
                  />
                </div>
                <div className="space-y-2">
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
          </TabsContent>

          <TabsContent value="social">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Social Media Links</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/yourschool"
                  />
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">Linkedin URL</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/school/yourschool"
                    />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/yourschool"
                  />
                </div>
                <div className="space-y-2">
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
          </TabsContent>

          <TabsContent value="footer">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Footer Settings</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="footer_text">Footer Description</Label>
                  <Textarea
                    id="footer_text"
                    value={formData.footer_text}
                    onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <h3 className="font-medium text-foreground">Transfer Certificate (TC) Links</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tc_apply_url">Apply for TC Link</Label>
                      <Input
                        id="tc_apply_url"
                        value={formData.tc_apply_url}
                        onChange={(e) => setFormData({ ...formData, tc_apply_url: e.target.value })}
                        placeholder="https://... or /apply-tc"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tc_verify_url">Verify TC Link</Label>
                      <Input
                        id="tc_verify_url"
                        value={formData.tc_verify_url}
                        onChange={(e) => setFormData({ ...formData, tc_verify_url: e.target.value })}
                        placeholder="https://... or /verify-tc"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30 md:col-span-2">
                  <h3 className="font-medium text-foreground mb-2">School Identifiers</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="affiliation_no">Affiliation No.</Label>
                      <Input
                        id="affiliation_no"
                        value={formData.affiliation_no}
                        onChange={(e) => setFormData({ ...formData, affiliation_no: e.target.value })}
                        placeholder="e.g., 1234567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="udise_code">UDISE Code</Label>
                      <Input
                        id="udise_code"
                        value={formData.udise_code}
                        onChange={(e) => setFormData({ ...formData, udise_code: e.target.value })}
                        placeholder="e.g., 27240801234"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} size="lg" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
