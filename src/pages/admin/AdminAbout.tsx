import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Award, Heart, Users, GraduationCap, Star, Shield, Target, Lightbulb, CheckCircle, MapPin, Phone, Mail, Clock, Building } from "lucide-react";
import { useCoreValues, useMilestones, useHighlightCards, useBranches, type CoreValue, type Milestone, type HighlightCard, type Branch } from "@/hooks/use-school-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const iconOptions = [
  { name: "Award", icon: Award },
  { name: "Heart", icon: Heart },
  { name: "Users", icon: Users },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Star", icon: Star },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "CheckCircle", icon: CheckCircle },
];

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

  const { data: coreValues, isLoading: coreValuesLoading } = useCoreValues();
  const { data: milestones, isLoading: milestonesLoading } = useMilestones();
  const { data: highlights, isLoading: highlightsLoading } = useHighlightCards();
  const { data: branches, isLoading: branchesLoading } = useBranches();

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

  const [localCoreValues, setLocalCoreValues] = useState<CoreValue[]>([]);
  const [localMilestones, setLocalMilestones] = useState<Milestone[]>([]);
  const [localHighlights, setLocalHighlights] = useState<HighlightCard[]>([]);
  const [localBranches, setLocalBranches] = useState<Branch[]>([]);

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

  useEffect(() => {
    if (coreValues) setLocalCoreValues(coreValues);
  }, [coreValues]);

  useEffect(() => {
    if (milestones) setLocalMilestones(milestones);
  }, [milestones]);

  useEffect(() => {
    if (highlights) setLocalHighlights(highlights);
  }, [highlights]);

  useEffect(() => {
    if (branches) setLocalBranches(branches);
  }, [branches]);

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
    },
  });

  const coreValueMutation = useMutation({
    mutationFn: async (values: CoreValue[]) => {
      const existingIds = coreValues?.map(v => v.id) || [];
      const currentIds = values.map(v => v.id).filter(id => !id.startsWith("temp-"));
      const toDelete = existingIds.filter(id => !currentIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("core_values").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("core_values").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("core_values").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["core-values"] });
    },
  });

  const milestoneMutation = useMutation({
    mutationFn: async (values: Milestone[]) => {
      const existingIds = milestones?.map(m => m.id) || [];
      const currentIds = values.map(m => m.id).filter(id => !id.startsWith("temp-"));
      const toDelete = existingIds.filter(id => !currentIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("milestones").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("milestones").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("milestones").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });

  const highlightMutation = useMutation({
    mutationFn: async (values: HighlightCard[]) => {
      const existingIds = highlights?.map(h => h.id) || [];
      const currentIds = values.map(h => h.id).filter(id => !id.startsWith("temp-"));
      const toDelete = existingIds.filter(id => !currentIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("highlight_cards").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("highlight_cards").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("highlight_cards").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlight-cards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-highlight-cards"] });
    },
  });

  const branchMutation = useMutation({
    mutationFn: async (values: Branch[]) => {
      const existingIds = branches?.map(b => b.id) || [];
      const currentIds = values.map(b => b.id).filter(id => !id.startsWith("temp-"));
      const toDelete = existingIds.filter(id => !currentIds.includes(id));

      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from("branches").delete().in("id", toDelete);
        if (delError) throw delError;
      }

      for (const val of values) {
        if (val.id.startsWith("temp-")) {
          const { id, ...rest } = val;
          const { error: insError } = await supabase.from("branches").insert([rest]);
          if (insError) throw insError;
        } else {
          const { error: updError } = await supabase.from("branches").update(val).eq("id", val.id);
          if (updError) throw updError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });

  const handleAddCoreValue = () => {
    const newVal: CoreValue = {
      id: `temp-${Date.now()}`,
      title: "New Value",
      description: "",
      icon_name: "Award",
      is_active: true,
      sort_order: localCoreValues.length,
    };
    setLocalCoreValues([...localCoreValues, newVal]);
  };

  const handleUpdateCoreValue = (id: string, updates: Partial<CoreValue>) => {
    setLocalCoreValues(localCoreValues.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const handleRemoveCoreValue = (id: string) => {
    setLocalCoreValues(localCoreValues.filter(v => v.id !== id));
  };

  const handleAddMilestone = () => {
    const newVal: Milestone = {
      id: `temp-${Date.now()}`,
      year: "2024",
      event: "New Milestone",
      is_active: true,
      sort_order: localMilestones.length,
    };
    setLocalMilestones([...localMilestones, newVal]);
  };

  const handleUpdateMilestone = (id: string, updates: Partial<Milestone>) => {
    setLocalMilestones(localMilestones.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleRemoveMilestone = (id: string) => {
    setLocalMilestones(localMilestones.filter(m => m.id !== id));
  };

  const handleAddHighlight = () => {
    const newVal: HighlightCard = {
      id: `temp-${Date.now()}`,
      title: "New Highlight",
      description: "",
      icon_name: "CheckCircle",
      is_active: true,
      sort_order: localHighlights.length,
    };
    setLocalHighlights([...localHighlights, newVal]);
  };

  const handleUpdateHighlight = (id: string, updates: Partial<HighlightCard>) => {
    setLocalHighlights(localHighlights.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const handleRemoveHighlight = (id: string) => {
    setLocalHighlights(localHighlights.filter(h => h.id !== id));
  };

  const handleAddBranch = () => {
    const newVal: Branch = {
      id: `temp-${Date.now()}`,
      name: "New Branch",
      address: "",
      phone: "",
      email: "",
      hours: "Mon - Sat: 8:00 AM - 4:00 PM",
      map_url: "",
      is_active: true,
      sort_order: localBranches.length,
    };
    setLocalBranches([...localBranches, newVal]);
  };

  const handleUpdateBranch = (id: string, updates: Partial<Branch>) => {
    setLocalBranches(localBranches.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleRemoveBranch = (id: string) => {
    setLocalBranches(localBranches.filter(b => b.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all([
        updateMutation.mutateAsync(formData),
        coreValueMutation.mutateAsync(localCoreValues),
        milestoneMutation.mutateAsync(localMilestones),
        highlightMutation.mutateAsync(localHighlights),
        branchMutation.mutateAsync(localBranches),
      ]);
      toast({ title: "All changes saved successfully!" });
    } catch (error) {
      toast({ title: "Error saving changes", variant: "destructive" });
    }
  };

  if (isLoading || coreValuesLoading || milestonesLoading || highlightsLoading || branchesLoading) {
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
          <h1 className="text-3xl font-bold text-foreground">About & Branches</h1>
          <p className="text-muted-foreground">Manage your school's about page content and branches</p>
        </div>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="about" className="px-6">About Us</TabsTrigger>
            <TabsTrigger value="branches" className="px-6">Our Branches</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="about" className="space-y-8">
              {/* Main Content */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Main Content
                </h2>
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
                      placeholder="A Legacy of Educational Excellence"
                    />
                  </div>
                  <div>
                    <RichTextEditor
                      label="Main Description"
                      value={formData.main_description}
                      onChange={(content) => setFormData({ ...formData, main_description: content })}
                      placeholder="Describe your school's story..."
                    />
                  </div>
                  <div>
                    <RichTextEditor
                      label="History (Optional)"
                      value={formData.history_text}
                      onChange={(content) => setFormData({ ...formData, history_text: content })}
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

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Mission
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mission_title">Mission Title</Label>
                      <Input
                        id="mission_title"
                        value={formData.mission_title}
                        onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <RichTextEditor
                        label="Mission Statement"
                        value={formData.mission_text}
                        onChange={(content) => setFormData({ ...formData, mission_text: content })}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-dark" />
                    Vision
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vision_title">Vision Title</Label>
                      <Input
                        id="vision_title"
                        value={formData.vision_title}
                        onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <RichTextEditor
                        label="Vision Statement"
                        value={formData.vision_text}
                        onChange={(content) => setFormData({ ...formData, vision_text: content })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive" />
                    Core Values
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCoreValue}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Value
                  </Button>
                </div>
                <div className="space-y-4">
                  {localCoreValues.map((value) => (
                    <div key={value.id} className="p-4 bg-background rounded-lg border border-border relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveCoreValue(value.id)}
                        className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={value.title}
                              onChange={(e) => handleUpdateCoreValue(value.id, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {iconOptions.map((opt) => (
                                <button
                                  key={opt.name}
                                  type="button"
                                  onClick={() => handleUpdateCoreValue(value.id, { icon_name: opt.name })}
                                  className={`p-2 rounded-md border ${value.icon_name === opt.name ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}
                                >
                                  <opt.icon className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <RichTextEditor
                            label="Description"
                            value={value.description || ""}
                            onChange={(content) => handleUpdateCoreValue(value.id, { description: content })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Journey (Milestones) */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Our Journey (Milestones)
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddMilestone}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {localMilestones.map((milestone) => (
                    <div key={milestone.id} className="p-4 bg-background rounded-lg border border-border relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <Label>Year</Label>
                          <Input
                            value={milestone.year}
                            onChange={(e) => handleUpdateMilestone(milestone.id, { year: e.target.value })}
                            placeholder="e.g., 1995"
                          />
                        </div>
                        <div>
                          <Label>Event</Label>
                          <Input
                            value={milestone.event}
                            onChange={(e) => handleUpdateMilestone(milestone.id, { event: e.target.value })}
                            placeholder="e.g., School founded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Orbit International (Highlights) */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Why Choose Orbit International
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddHighlight}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
                <div className="space-y-4">
                  {localHighlights.map((highlight) => (
                    <div key={highlight.id} className="p-4 bg-background rounded-lg border border-border relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(highlight.id)}
                        className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={highlight.title}
                              onChange={(e) => handleUpdateHighlight(highlight.id, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {iconOptions.map((opt) => (
                                <button
                                  key={opt.name}
                                  type="button"
                                  onClick={() => handleUpdateHighlight(highlight.id, { icon_name: opt.name })}
                                  className={`p-2 rounded-md border ${highlight.icon_name === opt.name ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}
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
                            value={highlight.description || ""}
                            onChange={(e) => handleUpdateHighlight(highlight.id, { description: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branches" className="space-y-8">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Manage Branches
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddBranch}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Branch
                  </Button>
                </div>

                <div className="space-y-6">
                  {localBranches.map((branch) => (
                    <div key={branch.id} className="p-6 bg-background rounded-xl border border-border relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(branch.id)}
                        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Branch Name</Label>
                            <Input
                              value={branch.name}
                              onChange={(e) => handleUpdateBranch(branch.id, { name: e.target.value })}
                              placeholder="e.g., Main Campus"
                            />
                          </div>
                          <div>
                            <Label>Address</Label>
                            <Textarea
                              value={branch.address}
                              onChange={(e) => handleUpdateBranch(branch.id, { address: e.target.value })}
                              placeholder="Full address of the branch"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Google Maps Embed URL</Label>
                            <Input
                              value={branch.map_url}
                              onChange={(e) => handleUpdateBranch(branch.id, { map_url: e.target.value })}
                              placeholder="https://www.google.com/maps/embed?..."
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Copy the 'src' attribute from the Google Maps iframe embed code</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Phone</Label>
                              <Input
                                value={branch.phone}
                                onChange={(e) => handleUpdateBranch(branch.id, { phone: e.target.value })}
                                placeholder="+91 ..."
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                value={branch.email}
                                onChange={(e) => handleUpdateBranch(branch.id, { email: e.target.value })}
                                placeholder="branch@orbitschool.com"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Office Hours</Label>
                            <Input
                              value={branch.hours}
                              onChange={(e) => handleUpdateBranch(branch.id, { hours: e.target.value })}
                              placeholder="Mon - Sat: 8:00 AM - 4:00 PM"
                            />
                          </div>
                          <div>
                            <Label>Sort Order</Label>
                            <Input
                              type="number"
                              value={branch.sort_order}
                              onChange={(e) => handleUpdateBranch(branch.id, { sort_order: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-4">
                            <input
                              type="checkbox"
                              id={`active-${branch.id}`}
                              checked={branch.is_active}
                              onChange={(e) => handleUpdateBranch(branch.id, { is_active: e.target.checked })}
                              className="rounded border-border"
                            />
                            <Label htmlFor={`active-${branch.id}`}>Branch is active and visible</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {localBranches.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                      <Building className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground">No branches added yet. Click "Add Branch" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-4 sticky bottom-8 py-4 bg-background/80 backdrop-blur-sm border-t border-border mt-12 z-10">
              <Button
                type="submit"
                size="lg"
                className="px-12"
                disabled={updateMutation.isPending || coreValueMutation.isPending || milestoneMutation.isPending || highlightMutation.isPending || branchMutation.isPending}
              >
                {updateMutation.isPending || coreValueMutation.isPending || milestoneMutation.isPending || highlightMutation.isPending || branchMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save All Changes
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
