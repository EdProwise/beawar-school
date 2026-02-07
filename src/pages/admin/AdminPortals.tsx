import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, X, GraduationCap, Users, UserCircle } from "lucide-react";

interface PortalContent {
  id: string;
  portal_type: string;
  page_title: string;
  page_subtitle: string | null;
  intro_text: string | null;
  login_url: string | null;
  features: string[] | null;
}

const portalIcons = {
  students: GraduationCap,
  teachers: Users,
  parents: UserCircle,
};

export default function AdminPortals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portals = [], isLoading } = useQuery({
    queryKey: ["admin-portals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portal_content")
        .select("*")
        .order("portal_type");
      if (error) throw error;
      return data as PortalContent[];
    },
  });

  const [forms, setForms] = useState<{ [key: string]: PortalContent }>({});
  const [newFeatures, setNewFeatures] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (portals.length > 0) {
      const formData: { [key: string]: PortalContent } = {};
      portals.forEach((portal) => {
        formData[portal.portal_type] = { ...portal };
      });
      setForms(formData);
    }
  }, [portals]);

  const updateMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: Partial<PortalContent> }) => {
      const { error } = await supabase
        .from("portal_content")
        .update(data)
        .eq("portal_type", type);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portals"] });
      queryClient.invalidateQueries({ queryKey: ["portal-content"] });
      toast({ title: "Portal updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error updating portal", variant: "destructive" });
    },
  });

  const handleSave = (type: string) => {
    const data = forms[type];
    if (data) {
      updateMutation.mutate({ type, data: {
        page_title: data.page_title,
        page_subtitle: data.page_subtitle,
        intro_text: data.intro_text,
        login_url: data.login_url,
        features: data.features,
      }});
    }
  };

  const updateForm = (type: string, field: string, value: any) => {
    setForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const addFeature = (type: string) => {
    const feature = newFeatures[type]?.trim();
    if (feature && forms[type]) {
      const currentFeatures = forms[type].features || [];
      updateForm(type, "features", [...currentFeatures, feature]);
      setNewFeatures((prev) => ({ ...prev, [type]: "" }));
    }
  };

  const removeFeature = (type: string, index: number) => {
    if (forms[type]) {
      const newFeaturesList = [...(forms[type].features || [])];
      newFeaturesList.splice(index, 1);
      updateForm(type, "features", newFeaturesList);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Portal Pages</h1>
        <p className="text-muted-foreground">Manage Student, Teacher, and Parent portal pages</p>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="teachers" className="gap-2">
            <Users className="w-4 h-4" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="parents" className="gap-2">
            <UserCircle className="w-4 h-4" />
            Parents
          </TabsTrigger>
        </TabsList>

        {["students", "teachers", "parents"].map((type) => {
          const Icon = portalIcons[type as keyof typeof portalIcons];
          const form = forms[type];
          if (!form) return null;

          return (
            <TabsContent key={type} value={type}>
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold capitalize">{type} Portal</h2>
                    <p className="text-muted-foreground text-sm">Configure the {type} portal page</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Page Title</Label>
                    <Input
                      value={form.page_title}
                      onChange={(e) => updateForm(type, "page_title", e.target.value)}
                      placeholder="e.g., Student Portal"
                    />
                  </div>
                  <div>
                    <Label>Page Subtitle</Label>
                    <Input
                      value={form.page_subtitle || ""}
                      onChange={(e) => updateForm(type, "page_subtitle", e.target.value)}
                      placeholder="e.g., Access your learning dashboard"
                    />
                  </div>
                </div>

                <div>
                  <Label>Introduction Text</Label>
                  <Textarea
                    value={form.intro_text || ""}
                    onChange={(e) => updateForm(type, "intro_text", e.target.value)}
                    rows={3}
                    placeholder="Describe what users can do in this portal..."
                  />
                </div>

                <div>
                  <Label>Login URL (External Portal Link)</Label>
                  <Input
                    value={form.login_url || ""}
                    onChange={(e) => updateForm(type, "login_url", e.target.value)}
                    placeholder="https://portal.yourschool.com/login"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If you have an external portal system, enter the login URL here
                  </p>
                </div>

                <div>
                  <Label>Portal Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {(form.features || []).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {feature}
                        <button
                          onClick={() => removeFeature(type, index)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newFeatures[type] || ""}
                      onChange={(e) => setNewFeatures((prev) => ({ ...prev, [type]: e.target.value }))}
                      placeholder="Add a feature..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature(type))}
                    />
                    <Button type="button" variant="outline" onClick={() => addFeature(type)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button onClick={() => handleSave(type)} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save {type.charAt(0).toUpperCase() + type.slice(1)} Portal
                  </Button>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </AdminLayout>
  );
}
