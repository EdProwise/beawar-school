import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Shield, FileText } from "lucide-react";

interface Section {
  title: string;
  content: string;
}

interface LegalPage {
  id: string;
  page_type: string;
  page_title: string;
  last_updated: string | null;
  content: string | null;
  sections: Section[];
}

export default function AdminLegalPages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["admin-legal-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_pages")
        .select("*")
        .order("page_type");
      if (error) throw error;
      return data as LegalPage[];
    },
  });

  const [forms, setForms] = useState<{ [key: string]: LegalPage }>({});

  useEffect(() => {
    if (pages.length > 0) {
      const formData: { [key: string]: LegalPage } = {};
      pages.forEach((page) => {
        formData[page.page_type] = { 
          ...page, 
          sections: Array.isArray(page.sections) ? page.sections : [] 
        };
      });
      setForms(formData);
    }
  }, [pages]);

  const updateMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: Partial<LegalPage> }) => {
      const { error } = await supabase
        .from("legal_pages")
        .update({
          page_title: data.page_title,
          last_updated: data.last_updated,
          content: data.content,
          sections: data.sections,
        })
        .eq("page_type", type);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-legal-pages"] });
      queryClient.invalidateQueries({ queryKey: ["legal-pages"] });
      toast({ title: "Page saved successfully!" });
    },
    onError: () => {
      toast({ title: "Error saving page", variant: "destructive" });
    },
  });

  const handleSave = (type: string) => {
    const data = forms[type];
    if (data) {
      updateMutation.mutate({ type, data });
    }
  };

  const updateForm = (type: string, field: string, value: any) => {
    setForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const addSection = (type: string) => {
    const currentSections = forms[type]?.sections || [];
    updateForm(type, "sections", [...currentSections, { title: "", content: "" }]);
  };

  const updateSection = (type: string, index: number, field: string, value: string) => {
    const newSections = [...(forms[type]?.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    updateForm(type, "sections", newSections);
  };

  const removeSection = (type: string, index: number) => {
    const newSections = [...(forms[type]?.sections || [])];
    newSections.splice(index, 1);
    updateForm(type, "sections", newSections);
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
        <h1 className="text-3xl font-bold text-foreground">Legal Pages</h1>
        <p className="text-muted-foreground">Manage Privacy Policy and Terms & Conditions</p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="terms" className="gap-2">
            <FileText className="w-4 h-4" />
            Terms & Conditions
          </TabsTrigger>
        </TabsList>

        {["privacy", "terms"].map((type) => {
          const form = forms[type];
          if (!form) return null;

          return (
            <TabsContent key={type} value={type}>
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">Page Settings</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Page Title</Label>
                      <Input
                        value={form.page_title}
                        onChange={(e) => updateForm(type, "page_title", e.target.value)}
                        placeholder={type === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                      />
                    </div>
                    <div>
                      <Label>Last Updated</Label>
                      <Input
                        value={form.last_updated || ""}
                        onChange={(e) => updateForm(type, "last_updated", e.target.value)}
                        placeholder="December 2024"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Introduction Text</Label>
                      <Textarea
                        value={form.content || ""}
                        onChange={(e) => updateForm(type, "content", e.target.value)}
                        rows={3}
                        placeholder="Brief introduction to this policy..."
                      />
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Content Sections</h2>
                    <Button type="button" variant="outline" onClick={() => addSection(type)}>
                      <Plus className="w-4 h-4" />
                      Add Section
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(form.sections || []).map((section, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg bg-secondary/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Section {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeSection(type, index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label>Section Title</Label>
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(type, index, "title", e.target.value)}
                              placeholder="e.g., Information We Collect"
                            />
                          </div>
                          <div>
                            <Label>Section Content</Label>
                            <Textarea
                              value={section.content}
                              onChange={(e) => updateSection(type, index, "content", e.target.value)}
                              rows={4}
                              placeholder="Describe this section..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(form.sections || []).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No sections yet. Click "Add Section" to create content.
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={() => handleSave(type)} disabled={updateMutation.isPending} size="lg">
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save {type === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </AdminLayout>
  );
}
