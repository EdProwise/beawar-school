import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Star, Image as ImageIcon, Sparkles, Layout, Palette } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FileUpload } from "@/components/admin/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeachingMethodSection {
  id: string;
  title: string;
  content: string;
  image_url: string;
  sort_order: number;
}

interface HeroContent {
  id: string;
  title: string;
  center_image: string;
  description?: string;
}

export default function AdminTeachingMethod() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: methodsData, isLoading: methodsLoading } = useQuery({
    queryKey: ["admin-teaching-methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_methods").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as TeachingMethodSection[];
    }
  });

  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ["admin-teaching-method-hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_method_content").select("*").maybeSingle();
      if (error) throw error;
      return data as HeroContent;
    }
  });

  const [sections, setSections] = useState<TeachingMethodSection[]>([]);
  const [hero, setHero] = useState<HeroContent>({
    id: "",
    title: "THINGS for our students and what we do",
    center_image: "",
    description: "Our pedagogical approach is designed to inspire curiosity and foster holistic development in every child."
  });

  useEffect(() => {
    if (methodsData) setSections(methodsData);
  }, [methodsData]);

  useEffect(() => {
    if (heroData) setHero(heroData);
  }, [heroData]);

  const saveMethodsMutation = useMutation({
    mutationFn: async (values: TeachingMethodSection[]) => {
      const { data: currentDbItems } = await supabase.from("teaching_methods").select("id");
      const dbIds = currentDbItems?.map(item => item.id) || [];
      const incomingIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = dbIds.filter(id => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("teaching_methods").delete().in("id", toDelete);
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          await supabase.from("teaching_methods").insert([rest]);
        } else {
          await supabase.from("teaching_methods").update(val).eq("id", val.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teaching-methods"] });
      queryClient.invalidateQueries({ queryKey: ["teaching-methods"] });
      toast({ title: "Teaching methods updated successfully" });
    },
    onError: () => toast({ title: "Error saving changes", variant: "destructive" })
  });

  const saveHeroMutation = useMutation({
    mutationFn: async (values: HeroContent) => {
      if (values.id) {
        await supabase.from("teaching_method_content").update(values).eq("id", values.id);
      } else {
        const { id, ...rest } = values;
        await supabase.from("teaching_method_content").insert([rest]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teaching-method-hero"] });
      queryClient.invalidateQueries({ queryKey: ["teaching-method-content"] });
      toast({ title: "Hero section updated successfully" });
    },
    onError: () => toast({ title: "Error saving hero section", variant: "destructive" })
  });

  const handleAddSection = () => {
    setSections([...sections, {
      id: `temp-${Date.now()}`,
      title: "New Method",
      content: "",
      image_url: "",
      sort_order: sections.length
    }]);
  };

  const handleUpdateSection = (id: string, updates: Partial<TeachingMethodSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSaveMethods = () => {
    saveMethodsMutation.mutate(sections);
  };

  const handleSaveHero = () => {
    saveHeroMutation.mutate(hero);
  };

  if (methodsLoading || heroLoading) {
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
      <div className="max-w-5xl pb-20 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 p-8 rounded-3xl border border-purple-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">Teaching Method Redesign</h1>
            </div>
            <p className="text-muted-foreground font-medium">Create a premium experience with multi-color themes and rich media</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAddSection} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-purple-100 transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" />
              Add New Method
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-8">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl border border-border/50 h-auto grid grid-cols-2 max-w-md">
            <TabsTrigger value="hero" className="rounded-xl py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-bold gap-2">
              <Layout className="w-4 h-4" />
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="methods" className="rounded-xl py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-bold gap-2">
              <Palette className="w-4 h-4" />
              Methods Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-border/50 shadow-xl shadow-purple-500/5 overflow-hidden rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent border-b border-border/50 pb-8">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Layout className="w-6 h-6 text-purple-600" />
                  Public Page Header
                </CardTitle>
                <CardDescription className="text-base">Configure the top section of your Teaching Method page</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Page Main Title</Label>
                      <Input
                        value={hero.title}
                        onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        placeholder="Enter catchy headline"
                        className="h-12 text-lg font-medium rounded-xl border-border/50 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Description Text</Label>
                      <Input
                        value={hero.description || ""}
                        onChange={(e) => setHero({ ...hero, description: e.target.value })}
                        placeholder="Enter short introduction"
                        className="h-12 rounded-xl border-border/50 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Hero / Center Image</Label>
                    <FileUpload
                      currentUrl={hero.center_image}
                      onUpload={(url) => setHero({ ...hero, center_image: url })}
                      className="rounded-3xl overflow-hidden"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border/50">
                  <Button onClick={handleSaveHero} disabled={saveHeroMutation.isPending} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-8">
                    {saveHeroMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Hero Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 gap-8">
              {sections.map((section, index) => (
                <Card key={section.id} className="border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-3xl group">
                  <div className={`h-2 w-full bg-gradient-to-r ${
                    index % 4 === 0 ? 'from-purple-500 to-indigo-500' :
                    index % 4 === 1 ? 'from-pink-500 to-rose-500' :
                    index % 4 === 2 ? 'from-cyan-500 to-blue-500' :
                    'from-emerald-500 to-teal-500'
                  }`} />
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                        index % 4 === 0 ? 'bg-purple-500' :
                        index % 4 === 1 ? 'bg-pink-500' :
                        index % 4 === 2 ? 'bg-cyan-500' :
                        'bg-emerald-500'
                      }`}>
                        {index + 1}
                      </div>
                      <CardTitle className="text-xl font-bold">Method Card #{index + 1}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSection(section.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Card Heading</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                            placeholder="e.g., Project-Based Learning"
                            className="h-12 text-lg font-semibold rounded-xl border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Rich Description</Label>
                          <div className="prose-sm max-w-none border border-border/50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-400/20 transition-all">
                            <RichTextEditor
                              content={section.content}
                              onChange={(content) => handleUpdateSection(section.id, { content })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-4 space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Card Image
                        </Label>
                        <FileUpload
                          currentUrl={section.image_url}
                          onUpload={(url) => handleUpdateSection(section.id, { image_url: url })}
                          className="aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-inner bg-muted/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-24 bg-muted/30 border-2 border-dashed border-border/50 rounded-[2.5rem] space-y-4">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Star className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">No methods added yet</h3>
                    <p className="text-muted-foreground">Click the "Add New Method" button to start building your cards.</p>
                  </div>
                  <Button onClick={handleAddSection} variant="outline" className="rounded-xl px-8 border-border/50">
                    Create First Method
                  </Button>
                </div>
              )}

              <div className="fixed bottom-8 right-8 z-50">
                <Button 
                  size="lg" 
                  onClick={handleSaveMethods} 
                  disabled={saveMethodsMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-8 shadow-2xl shadow-purple-500/30 font-bold text-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  {saveMethodsMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                  Save All Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
