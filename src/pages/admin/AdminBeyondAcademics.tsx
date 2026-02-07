import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Zap, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FileUpload } from "@/components/admin/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BeyondAcademicsSection {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  category?: string;
  sort_order: number;
}

const CATEGORIES = [
  { id: "beyond-academics", name: "Beyond Academics" },
  { id: "entrepreneur-skills", name: "Entrepreneur Skills" },
  { id: "residential-school", name: "Residential School" }
];

export default function AdminBeyondAcademics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "beyond-academics");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  const { data: beyondData, isLoading } = useQuery({
    queryKey: ["admin-beyond-academics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beyond_academics")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as BeyondAcademicsSection[];
    }
  });

  const [sections, setSections] = useState<BeyondAcademicsSection[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (beyondData && !isInitialized) {
      setSections(beyondData);
      setIsInitialized(true);
    }
  }, [beyondData, isInitialized]);

  const filteredSections = sections.filter(s => 
    s.category === activeTab || (!s.category && activeTab === "beyond-academics")
  );

  const saveMutation = useMutation({
    mutationFn: async (values: BeyondAcademicsSection[]) => {
      // Get all items currently in DB for this category
      const { data: currentDbItems } = await supabase
        .from("beyond_academics")
        .select("id")
        .eq("category", activeTab);
        
      const dbIds = currentDbItems?.map(item => item.id) || [];
      const incomingIds = values
        .filter(v => (v.category === activeTab || (!v.category && activeTab === "beyond-academics")))
        .map(v => v.id)
        .filter(id => !id.startsWith("temp-"));
      
      const toDelete = dbIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("beyond_academics").delete().in("id", toDelete);
      }

      for (const val of values) {
        // Ensure category is set
        const sectionToSave = { 
          ...val, 
          category: val.category || (activeTab === "beyond-academics" ? "beyond-academics" : activeTab) 
        };

        if (sectionToSave.id.startsWith("temp-")) {
          const { id, ...rest } = sectionToSave;
          await supabase.from("beyond_academics").insert([rest]);
        } else {
          await supabase.from("beyond_academics").update(sectionToSave).eq("id", sectionToSave.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-beyond-academics"] });
      queryClient.invalidateQueries({ queryKey: ["beyond-academics"] });
      toast({ title: "Updated successfully" });
    },
    onError: () => toast({ title: "Error saving changes", variant: "destructive" })
  });

  const handleAddSection = () => {
    setSections([...sections, {
      id: `temp-${Date.now()}`,
      title: "New Section",
      content: "",
      image_url: "",
      images: [],
      video_url: "",
      category: activeTab,
      sort_order: sections.length
    }]);
  };

  const handleUpdateSection = (id: string, updates: Partial<BeyondAcademicsSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(sections);
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Beyond Academics Management</h1>
            <p className="text-muted-foreground">Manage co-curricular and enrichment content</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList>
              {CATEGORIES.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button onClick={handleAddSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section to {CATEGORIES.find(c => c.id === activeTab)?.name}
            </Button>
          </div>

          {CATEGORIES.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {filteredSections.map((section) => (
                  <div key={section.id} className="bg-card rounded-xl border border-border p-6 shadow-sm relative group">
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(section.id)}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                          placeholder="e.g., Leadership Programs"
                        />
                      </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="flex items-center gap-2 mb-2">
                                <ImageIcon className="w-4 h-4" />
                                Multiple Images
                              </Label>
                              <FileUpload
                                accept="image"
                                multiple={true}
                                currentUrls={section.images || []}
                                onMultiUpload={(urls) => handleUpdateSection(section.id, { images: urls })}
                                onUpload={(url) => {
                                  const currentImages = section.images || [];
                                  if (!currentImages.includes(url)) {
                                    handleUpdateSection(section.id, { images: [...currentImages, url] });
                                  }
                                }}
                              />
                            </div>
                          <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <VideoIcon className="w-4 h-4" />
                            Video
                          </Label>
                          <FileUpload
                            accept="video"
                            currentUrl={section.video_url}
                            onUpload={(url) => handleUpdateSection(section.id, { video_url: url })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Content</Label>
                        <RichTextEditor
                          value={section.content}
                          onChange={(content) => handleUpdateSection(section.id, { content })}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredSections.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                    <Zap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No sections added for {cat.name} yet. Click "Add Section" to start.</p>
                  </div>
                )}

                <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
                  <Button type="submit" size="lg" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save {cat.name}
                  </Button>
                </div>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
