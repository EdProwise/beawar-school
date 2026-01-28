import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Loader2, Save, Plus, Trash2, Zap, Star, Trophy, Music, Palette, Globe, 
    Rocket, Shield, Award, Clock, Target, Heart, Camera, BookOpen, Users, Upload, Image as ImageIcon, Video
  } from "lucide-react";

import { 
  useExtracurricularCategories, 
  useExtracurricularHighlights,
  type ExtracurricularCategory,
  type ExtracurricularHighlight
} from "@/hooks/use-school-data";

const iconOptions = [
  { name: "Trophy", icon: Trophy },
  { name: "Music", icon: Music },
  { name: "Palette", icon: Palette },
  { name: "Globe", icon: Globe },
  { name: "Rocket", icon: Rocket },
  { name: "Star", icon: Star },
  { name: "Shield", icon: Shield },
  { name: "Zap", icon: Zap },
  { name: "Award", icon: Award },
  { name: "Clock", icon: Clock },
  { name: "Target", icon: Target },
  { name: "Heart", icon: Heart },
  { name: "Camera", icon: Camera },
  { name: "BookOpen", icon: BookOpen },
  { name: "Users", icon: Users },
];

export default function AdminExtracurricular() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: categories, isLoading: loadingCats } = useExtracurricularCategories();
  const { data: highlights, isLoading: loadingHighs } = useExtracurricularHighlights();
  
  const [localCategories, setLocalCategories] = useState<ExtracurricularCategory[]>([]);
  const [localHighlights, setLocalHighlights] = useState<ExtracurricularHighlight[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (categories && !hasInitialized) {
      setLocalCategories(categories);
      if (highlights) {
        setLocalHighlights(highlights);
        setHasInitialized(true);
      }
    }
  }, [categories, highlights, hasInitialized]);

  const categoryMutation = useMutation({
    mutationFn: async (values: ExtracurricularCategory[]) => {
      // Determine what to delete by comparing current query data with incoming values
      const initialIds = categories?.map(c => c.id) || [];
      const incomingIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = initialIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("extracurricular_categories").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        const payload = { ...val };
        if (payload.id.startsWith("temp-")) {
          const { id, ...rest } = payload;
          const { error: insError } = await supabase.from("extracurricular_categories").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("extracurricular_categories").update(payload).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurricular-categories"] });
      toast({ title: "Categories updated successfully" });
    },
    onError: (error) => {
      console.error("Error saving categories:", error);
      toast({ title: "Error saving categories", variant: "destructive" });
    }
  });

  const highlightMutation = useMutation({
    mutationFn: async (values: ExtracurricularHighlight[]) => {
      // Determine what to delete by comparing current query data with incoming values
      const initialIds = highlights?.map(h => h.id) || [];
      const incomingIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = initialIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("extracurricular_highlights").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("extracurricular_highlights").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("extracurricular_highlights").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurricular-highlights"] });
      toast({ title: "Highlights updated successfully" });
    },
    onError: (error) => {
      console.error("Error saving highlights:", error);
      toast({ title: "Error saving highlights", variant: "destructive" });
    }
  });

    const handleAddCategory = () => {
      const newVal: ExtracurricularCategory = {
        id: `temp-${Date.now()}`,
        title: "New Category",
        description: "",
        icon_name: "Trophy",
        activities: [],
        image_url: null,
        video_url: null,
        is_active: true,
        sort_order: localCategories.length,
      };
      setLocalCategories([...localCategories, newVal]);
    };

    const handleFileUpload = async (id: string, file: File, field: "image_url" | "video_url") => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", `extracurricular/${Date.now()}-${file.name}`);

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        const url = result.data.url;

        handleUpdateCategory(id, { [field]: url });
        toast({ title: `${field === "image_url" ? "Image" : "Video"} uploaded successfully` });
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: `Error uploading ${field === "image_url" ? "image" : "video"}`, variant: "destructive" });
      }
    };


  const handleUpdateCategory = (id: string, updates: Partial<ExtracurricularCategory>) => {
    setLocalCategories(localCategories.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleRemoveCategory = (id: string) => {
    setLocalCategories(localCategories.filter(c => c.id !== id));
  };

  const handleAddHighlight = () => {
    const newVal: ExtracurricularHighlight = {
      id: `temp-${Date.now()}`,
      title: "New Highlight",
      description: "",
      icon_name: "Star",
      is_active: true,
      sort_order: localHighlights.length,
    };
    setLocalHighlights([...localHighlights, newVal]);
  };

  const handleUpdateHighlight = (id: string, updates: Partial<ExtracurricularHighlight>) => {
    setLocalHighlights(localHighlights.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const handleRemoveHighlight = (id: string) => {
    setLocalHighlights(localHighlights.filter(h => h.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    categoryMutation.mutate(localCategories);
    highlightMutation.mutate(localHighlights);
  };

  if (loadingCats || loadingHighs) {
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
      <div className="max-w-5xl pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Extracurricular Content</h1>
          <p className="text-muted-foreground">Manage activity categories and program highlights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
              <TabsTrigger value="categories">Activity Categories</TabsTrigger>
              <TabsTrigger value="highlights">Program Highlights</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Activity Categories
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                <div className="space-y-6">
                  {localCategories.map((cat) => (
                      <div key={cat.id} className="p-5 bg-background rounded-lg border border-border relative group">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCategory(cat.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Category Title</Label>
                            <Input
                              value={cat.title}
                              onChange={(e) => handleUpdateCategory(cat.id, { title: e.target.value })}
                              placeholder="e.g., Sports & Athletics"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Icon</Label>
                            <div className="flex flex-wrap gap-2">
                              {iconOptions.map((opt) => (
                                <button
                                  key={opt.name}
                                  type="button"
                                  onClick={() => handleUpdateCategory(cat.id, { icon_name: opt.name })}
                                  className={`p-2 rounded-md border transition-all ${
                                    cat.icon_name === opt.name 
                                      ? "bg-primary text-primary-foreground border-primary" 
                                      : "bg-card border-border hover:border-primary"
                                  }`}
                                  title={opt.name}
                                >
                                  <opt.icon className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </div>
                            <div>
                              <Label>Activities (comma separated)</Label>
                              <Input
                                value={cat.activities?.join(", ") || ""}
                                onChange={(e) => handleUpdateCategory(cat.id, { 
                                  activities: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "") 
                                })}
                                placeholder="e.g., Football, Basketball, Swimming"
                              />
                            </div>
                            
                            <div>
                              <Label>Media Assets</Label>
                              <div className="mt-2 grid grid-cols-2 gap-4">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">Category Image</Label>
                                  <div className="flex flex-col gap-2">
                                    {cat.image_url ? (
                                      <div className="relative aspect-video rounded-md overflow-hidden border border-border">
                                        <img src={cat.image_url} alt={cat.title} className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateCategory(cat.id, { image_url: null })}
                                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="aspect-video rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                      </div>
                                    )}
                                    
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      id={`image-file-${cat.id}`}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(cat.id, file, "image_url");
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => document.getElementById(`image-file-${cat.id}`)?.click()}
                                    >
                                      <Upload className="w-4 h-4 mr-2" />
                                      {cat.image_url ? "Change Image" : "Upload Image"}
                                    </Button>
                                  </div>
                                </div>

                                {/* Video Upload */}
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">Category Video</Label>
                                  <div className="flex flex-col gap-2">
                                    {cat.video_url ? (
                                      <div className="relative aspect-video rounded-md overflow-hidden border border-border bg-black flex items-center justify-center">
                                        <video src={cat.video_url} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                          <Video className="w-8 h-8 text-white opacity-50" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateCategory(cat.id, { video_url: null })}
                                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="aspect-video rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                                        <Video className="w-8 h-8 text-muted-foreground/30" />
                                      </div>
                                    )}
                                    
                                    <Input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      id={`video-file-${cat.id}`}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(cat.id, file, "video_url");
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => document.getElementById(`video-file-${cat.id}`)?.click()}
                                    >
                                      <Upload className="w-4 h-4 mr-2" />
                                      {cat.video_url ? "Change Video" : "Upload Video"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-2">
                                Max 50MB for videos. Recommended aspect ratio 16:9.
                              </p>
                            </div>
                          </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={cat.description || ""}
                            onChange={(e) => handleUpdateCategory(cat.id, { description: e.target.value })}
                            rows={8}
                            placeholder="Describe this activity category..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {localCategories.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No categories added yet. Click "Add Category" to start.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="highlights" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Program Highlights
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddHighlight}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>

                  <div className="space-y-6">
                    {localHighlights.map((high) => (
                      <div key={high.id} className="p-5 bg-background rounded-lg border border-border relative group">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveHighlight(high.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Highlight Title</Label>
                            <Input
                              value={high.title}
                              onChange={(e) => handleUpdateHighlight(high.id, { title: e.target.value })}
                              placeholder="e.g., Holistic Growth"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Icon</Label>
                            <div className="flex flex-wrap gap-2">
                              {iconOptions.map((opt) => (
                                <button
                                  key={opt.name}
                                  type="button"
                                  onClick={() => handleUpdateHighlight(high.id, { icon_name: opt.name })}
                                  className={`p-2 rounded-md border transition-all ${
                                    high.icon_name === opt.name 
                                      ? "bg-primary text-primary-foreground border-primary" 
                                      : "bg-card border-border hover:border-primary"
                                  }`}
                                  title={opt.name}
                                >
                                  <opt.icon className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={high.description || ""}
                            onChange={(e) => handleUpdateHighlight(high.id, { description: e.target.value })}
                            rows={5}
                            placeholder="Briefly describe this highlight..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {localHighlights.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No highlights added yet. Click "Add Highlight" to start.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border mt-12 z-10">
            <Button
              type="submit"
              size="lg"
              className="px-12"
              disabled={categoryMutation.isPending || highlightMutation.isPending}
            >
              {(categoryMutation.isPending || highlightMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save All Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
