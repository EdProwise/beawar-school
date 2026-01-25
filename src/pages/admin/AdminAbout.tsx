import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function AdminAbout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: about, isLoading } = useQuery({
    queryKey: ["admin-about-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    section_title: "About Us",
    main_heading: "",
    main_description: "",
    mission_title: "Our Mission",
    mission_text: "",
    vision_title: "Our Vision",
    vision_text: "",
    history_text: "",
    main_image_url: "",
    years_of_excellence: 25,
  });

  useEffect(() => {
    if (about) {
      setFormData({
        section_title: about.section_title || "About Us",
        main_heading: about.main_heading || "",
        main_description: about.main_description || "",
        mission_title: about.mission_title || "Our Mission",
        mission_text: about.mission_text || "",
        vision_title: about.vision_title || "Our Vision",
        vision_text: about.vision_text || "",
        history_text: about.history_text || "",
        main_image_url: about.main_image_url || "",
        years_of_excellence: about.years_of_excellence || 25,
      });
    }
  }, [about]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (about?.id) {
        const { error } = await supabase
          .from("about_content")
          .update(data)
          .eq("id", about.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("about_content")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-about-content"] });
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
      toast({ title: "About content saved successfully!" });
    },
    onError: () => {
      toast({ title: "Error saving content", variant: "destructive" });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">About Page Content</h1>
          <p className="text-muted-foreground">Manage your school's about page content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Main Content</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_title">Section Title</Label>
                  <Input
                    id="section_title"
                    value={formData.section_title}
                    onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <Label htmlFor="years_of_excellence">Years of Excellence</Label>
                  <Input
                    id="years_of_excellence"
                    type="number"
                    value={formData.years_of_excellence}
                    onChange={(e) => setFormData({ ...formData, years_of_excellence: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="main_heading">Main Heading</Label>
                <Input
                  id="main_heading"
                  value={formData.main_heading}
                  onChange={(e) => setFormData({ ...formData, main_heading: e.target.value })}
                  placeholder="Welcome to Our School"
                />
              </div>
              <div>
                <Label htmlFor="main_description">Main Description</Label>
                <Textarea
                  id="main_description"
                  value={formData.main_description}
                  onChange={(e) => setFormData({ ...formData, main_description: e.target.value })}
                  rows={4}
                  placeholder="Describe your school's story and what makes it unique..."
                />
              </div>
              <div>
                <Label htmlFor="history_text">History (Optional)</Label>
                <Textarea
                  id="history_text"
                  value={formData.history_text}
                  onChange={(e) => setFormData({ ...formData, history_text: e.target.value })}
                  rows={3}
                  placeholder="Additional history or background information..."
                />
              </div>
              <div>
                <Label htmlFor="main_image_url">Main Image URL</Label>
                <Input
                  id="main_image_url"
                  value={formData.main_image_url}
                  onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Mission</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mission_title">Mission Title</Label>
                <Input
                  id="mission_title"
                  value={formData.mission_title}
                  onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })}
                  placeholder="Our Mission"
                />
              </div>
              <div>
                <Label htmlFor="mission_text">Mission Statement</Label>
                <Textarea
                  id="mission_text"
                  value={formData.mission_text}
                  onChange={(e) => setFormData({ ...formData, mission_text: e.target.value })}
                  rows={4}
                  placeholder="To provide holistic education that empowers students..."
                />
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Vision</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vision_title">Vision Title</Label>
                <Input
                  id="vision_title"
                  value={formData.vision_title}
                  onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })}
                  placeholder="Our Vision"
                />
              </div>
              <div>
                <Label htmlFor="vision_text">Vision Statement</Label>
                <Textarea
                  id="vision_text"
                  value={formData.vision_text}
                  onChange={(e) => setFormData({ ...formData, vision_text: e.target.value })}
                  rows={4}
                  placeholder="To be a globally recognized institution..."
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
                Save Content
              </>
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
