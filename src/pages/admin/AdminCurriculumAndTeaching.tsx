import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, BookOpen, ClipboardList, Image as ImageIcon, CheckCircle, ExternalLink, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CurriculumContent {
  id?: string;
  title: string;
  main_image: string;
  preschool_title: string;
  preschool_desc: string;
  strongroots_title: string;
  strongroots_desc: string;
  nep_title: string;
  nep_desc1: string;
  nep_desc2: string;
  admission_title: string;
  admission_subtitle: string;
  admission_year: string;
  admission_btn_text: string;
}

interface CurriculumGallery {
  id: string;
  image_url: string;
  sort_order: number;
}

interface CurriculumActivity {
  id: string;
  text: string;
  sort_order: number;
}

interface TeachingMethodContent {
  id?: string;
  title: string;
  center_image: string;
}

interface TeachingMethodCard {
  id: string;
  title: string;
  content: string;
  link_text?: string;
  link_url?: string;
  position: number; // 0, 1, 2, 3
}

export default function AdminCurriculumAndTeaching() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Curriculum Data
  const { data: curriculumContent, isLoading: curriculumLoading } = useQuery({
    queryKey: ["admin-curriculum-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("curriculum_content").select("*").maybeSingle();
      if (error) throw error;
      return data as CurriculumContent;
    }
  });

  const { data: curriculumGallery, isLoading: galleryLoading } = useQuery({
    queryKey: ["admin-curriculum-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("curriculum_gallery").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CurriculumGallery[];
    }
  });

  const { data: curriculumActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["admin-curriculum-activities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("curriculum_activities").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CurriculumActivity[];
    }
  });

  // Teaching Method Data
  const { data: teachingContent, isLoading: teachingLoading } = useQuery({
    queryKey: ["admin-teaching-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_method_content").select("*").maybeSingle();
      if (error) throw error;
      return data as TeachingMethodContent;
    }
  });

  const { data: teachingCards, isLoading: cardsLoading } = useQuery({
    queryKey: ["admin-teaching-cards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_method_cards").select("*").order("position", { ascending: true });
      if (error) throw error;
      return data as TeachingMethodCard[];
    }
  });

  // Local States
  const [curForm, setCurForm] = useState<CurriculumContent>({
    title: "DBA's Education Pathway",
    main_image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
    preschool_title: "Fun and Educational Preschool Activities",
    preschool_desc: "Preschool activities aim to foster learning, creativity, and development in children aged 3-5. These activities encompass arts and crafts, storytelling, music, sensory play, outdoor play and many many more like :",
    strongroots_title: "STRONGROOTS PROGRAM (Primary And Secondary)",
    strongroots_desc: "Doon Blossom Academy, Ahmedabad, known for holistic student development is affiliated to CBSE Board. We have a special foundation curriculum for grades VII & VIII focusing on essential topics. We aim to ensure a smooth transition and strong foundation for future studies with the STRONGROOTS program.",
    nep_title: "A Holistic Educational Framework in Accordance with NEP 2020 Principles -",
    nep_desc1: "The educational framework at Doon Blossom Academy aligns with the National Education Policy (NEP) 2020, emphasizing trust, autonomy, and flexibility. It prioritizes child-centered learning in preschool and primary education. The focus is on nurturing talents, curiosity, and real-world exposure, while also providing free guidance for national-level exams and reducing financial burdens.",
    nep_desc2: "The system aims to cultivate student's interest, promote equal opportunities, diverse teaching techniques, collaboration, and essential skill development in a respectful learning environment. Competencies developed include self-direction, problem-solving, effective communication and Sanskar building for holistic development.",
    admission_title: "Admission Open",
    admission_subtitle: "Register Your Child",
    admission_year: "2026-27",
    admission_btn_text: "Apply Now"
  });

  const [curGallery, setCurGallery] = useState<CurriculumGallery[]>([]);
  const [curActivities, setCurActivities] = useState<CurriculumActivity[]>([]);

  const [teachForm, setTeachForm] = useState<TeachingMethodContent>({
    title: "What we do?",
    center_image: "https://images.unsplash.com/photo-1580894732444-8ecdead79730?auto=format&fit=crop&q=80&w=800"
  });

  const [teachCards, setTeachCards] = useState<TeachingMethodCard[]>([]);

  useEffect(() => {
    if (curriculumContent) setCurForm(curriculumContent);
  }, [curriculumContent]);

  useEffect(() => {
    if (curriculumGallery) setCurGallery(curriculumGallery);
  }, [curriculumGallery]);

  useEffect(() => {
    if (curriculumActivities) setCurActivities(curriculumActivities);
  }, [curriculumActivities]);

  useEffect(() => {
    if (teachingContent) setTeachForm(teachingContent);
  }, [teachingContent]);

  useEffect(() => {
    if (teachingCards) setTeachCards(teachingCards);
    else {
      // Initialize 4 cards if not exists
      setTeachCards([
        { id: 'c0', position: 0, title: 'Teaching with Passion', content: 'Our instructors inspire from the heart, going beyond textbooks.' },
        { id: 'c1', position: 1, title: 'Tech-Enhanced Classrooms', content: 'Our digital facilities create an engaging learning environment.' },
        { id: 'c2', position: 2, title: 'Interactive Clubs', content: 'Students form groups to foster curiosity and hands-on experiences.', link_text: 'Skill Development Clubs', link_url: '/extracurricular' },
        { id: 'c3', position: 3, title: 'Love-Centric Learning', content: 'We cultivate love for knowledge, making learning a joyous journey.' }
      ]);
    }
  }, [teachingCards]);

  // Mutations
  const saveCurriculumMutation = useMutation({
    mutationFn: async () => {
      // Save Main Content
      if (curForm.id) {
        await supabase.from("curriculum_content").update(curForm).eq("id", curForm.id);
      } else {
        await supabase.from("curriculum_content").insert([curForm]);
      }

      // Save Gallery
      const existingGalIds = curriculumGallery?.map(g => g.id) || [];
      const currentGalIds = curGallery.map(g => g.id).filter(id => !id.startsWith("temp-"));
      const galToDelete = existingGalIds.filter(id => !currentGalIds.includes(id));
      if (galToDelete.length > 0) await supabase.from("curriculum_gallery").delete().in("id", galToDelete);
      
      for (const item of curGallery) {
        if (item.id.startsWith("temp-")) {
          const { id, ...rest } = item;
          await supabase.from("curriculum_gallery").insert([rest]);
        } else {
          await supabase.from("curriculum_gallery").update(item).eq("id", item.id);
        }
      }

      // Save Activities
      const existingActIds = curriculumActivities?.map(a => a.id) || [];
      const currentActIds = curActivities.map(a => a.id).filter(id => !id.startsWith("temp-"));
      const actToDelete = existingActIds.filter(id => !currentActIds.includes(id));
      if (actToDelete.length > 0) await supabase.from("curriculum_activities").delete().in("id", actToDelete);

      for (const item of curActivities) {
        if (item.id.startsWith("temp-")) {
          const { id, ...rest } = item;
          await supabase.from("curriculum_activities").insert([rest]);
        } else {
          await supabase.from("curriculum_activities").update(item).eq("id", item.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-curriculum-content"] });
      queryClient.invalidateQueries({ queryKey: ["admin-curriculum-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["admin-curriculum-activities"] });
      toast({ title: "Curriculum saved successfully" });
    }
  });

  const saveTeachingMutation = useMutation({
    mutationFn: async () => {
      // Save Main Content
      if (teachForm.id) {
        await supabase.from("teaching_method_content").update(teachForm).eq("id", teachForm.id);
      } else {
        await supabase.from("teaching_method_content").insert([teachForm]);
      }

      // Save Cards (always upsert by position)
      for (const card of teachCards) {
        const { id, ...rest } = card;
        if (id && !id.startsWith('c')) {
           await supabase.from("teaching_method_cards").update(rest).eq("id", id);
        } else {
           await supabase.from("teaching_method_cards").insert([rest]);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teaching-content"] });
      queryClient.invalidateQueries({ queryKey: ["admin-teaching-cards"] });
      toast({ title: "Teaching Method saved successfully" });
    }
  });

  // Handlers
  const handleAddGallery = () => {
    setCurGallery([...curGallery, { id: `temp-${Date.now()}`, image_url: "", sort_order: curGallery.length }]);
  };

  const handleAddActivity = () => {
    setCurActivities([...curActivities, { id: `temp-${Date.now()}`, text: "", sort_order: curActivities.length }]);
  };

  if (curriculumLoading || galleryLoading || activitiesLoading || teachingLoading || cardsLoading) {
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
      <div className="max-w-6xl pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Curriculum & Teaching Method</h1>
          <p className="text-muted-foreground">Manage the content for your educational pathway and teaching style</p>
        </div>

        <Tabs defaultValue="curriculum" className="space-y-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="curriculum" className="flex gap-2">
              <BookOpen className="w-4 h-4" /> Curriculum
            </TabsTrigger>
            <TabsTrigger value="teaching" className="flex gap-2">
              <ClipboardList className="w-4 h-4" /> Teaching Method
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Content Card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Main Content
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input value={curForm.title} onChange={e => setCurForm({...curForm, title: e.target.value})} />
                  </div>
                  <div>
                    <Label>Main Image URL</Label>
                    <Input value={curForm.main_image} onChange={e => setCurForm({...curForm, main_image: e.target.value})} />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold mb-3">Preschool Section</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Section Title</Label>
                      <Input value={curForm.preschool_title} onChange={e => setCurForm({...curForm, preschool_title: e.target.value})} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={curForm.preschool_desc} onChange={e => setCurForm({...curForm, preschool_desc: e.target.value})} rows={3} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold mb-3">Strongroots Program</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Program Title</Label>
                      <Input value={curForm.strongroots_title} onChange={e => setCurForm({...curForm, strongroots_title: e.target.value})} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={curForm.strongroots_desc} onChange={e => setCurForm({...curForm, strongroots_desc: e.target.value})} rows={3} />
                    </div>
                  </div>
                </div>
              </div>

              {/* NEP & Admission Card */}
              <div className="space-y-8">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" /> NEP 2020 Framework
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Framework Title</Label>
                      <Input value={curForm.nep_title} onChange={e => setCurForm({...curForm, nep_title: e.target.value})} />
                    </div>
                    <div>
                      <Label>Paragraph 1 (Italic)</Label>
                      <Textarea value={curForm.nep_desc1} onChange={e => setCurForm({...curForm, nep_desc1: e.target.value})} rows={4} />
                    </div>
                    <div>
                      <Label>Paragraph 2</Label>
                      <Textarea value={curForm.nep_desc2} onChange={e => setCurForm({...curForm, nep_desc2: e.target.value})} rows={4} />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-[#A11B5A]">
                    <ImageIcon className="w-5 h-5" /> Admission Card
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Card Header</Label>
                      <Input value={curForm.admission_title} onChange={e => setCurForm({...curForm, admission_title: e.target.value})} />
                    </div>
                    <div>
                      <Label>Card Subtitle</Label>
                      <Input value={curForm.admission_subtitle} onChange={e => setCurForm({...curForm, admission_subtitle: e.target.value})} />
                    </div>
                    <div>
                      <Label>Batch Year</Label>
                      <Input value={curForm.admission_year} onChange={e => setCurForm({...curForm, admission_year: e.target.value})} />
                    </div>
                    <div>
                      <Label>Button Text</Label>
                      <Input value={curForm.admission_btn_text} onChange={e => setCurForm({...curForm, admission_btn_text: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery & Activities List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" /> Gallery Images (4)
                  </h2>
                  <Button size="sm" variant="outline" onClick={handleAddGallery} disabled={curGallery.length >= 4}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {curGallery.map((img, idx) => (
                    <div key={img.id} className="relative group p-2 border border-border rounded-lg">
                      <Label className="text-[10px] text-muted-foreground uppercase">Image {idx + 1}</Label>
                      <Input 
                        value={img.image_url} 
                        placeholder="URL" 
                        className="mt-1"
                        onChange={e => setCurGallery(curGallery.map(g => g.id === img.id ? {...g, image_url: e.target.value} : g))} 
                      />
                      <button 
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setCurGallery(curGallery.filter(g => g.id !== img.id))}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-500" /> Preschool Activities
                  </h2>
                  <Button size="sm" variant="outline" onClick={handleAddActivity}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {curActivities.map((act) => (
                    <div key={act.id} className="flex gap-2">
                      <Input 
                        value={act.text} 
                        placeholder="Activity description" 
                        onChange={e => setCurActivities(curActivities.map(a => a.id === act.id ? {...a, text: e.target.value} : a))} 
                      />
                      <Button variant="ghost" size="icon" onClick={() => setCurActivities(curActivities.filter(a => a.id !== act.id))}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={() => saveCurriculumMutation.mutate()} disabled={saveCurriculumMutation.isPending}>
                {saveCurriculumMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Curriculum Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="teaching" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Teaching Hero Content */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" /> Hero Section
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input value={teachForm.title} onChange={e => setTeachForm({...teachForm, title: e.target.value})} />
                  </div>
                  <div>
                    <Label>Center Image URL (High quality)</Label>
                    <Input value={teachForm.center_image} onChange={e => setTeachForm({...teachForm, center_image: e.target.value})} />
                    <p className="text-[10px] text-muted-foreground mt-1">Recommended size: Portrait (4:5 ratio)</p>
                  </div>
                </div>
              </div>

              {/* Teaching Cards Info */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                 <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" /> Layout Instructions
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Teaching Method page uses a fixed 4-card layout around the central image:
                  <br /><br />
                  - <strong>Card 1 & 2</strong>: Appear on the LEFT side.
                  <br />
                  - <strong>Card 3 & 4</strong>: Appear on the RIGHT side.
                  <br /><br />
                  One card (Card 3 by default) supports an optional external link for Skill Development Clubs.
                </p>
              </div>
            </div>

            {/* 4 Cards Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teachCards.map((card, idx) => (
                <div key={card.id} className="bg-card rounded-xl border border-border p-6 shadow-md space-y-4 relative">
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded">
                    CARD {idx + 1} ({idx < 2 ? 'LEFT' : 'RIGHT'})
                  </div>
                  <div className="space-y-3 pt-2">
                    <div>
                      <Label>Card Title</Label>
                      <Input value={card.title} onChange={e => setTeachCards(teachCards.map(c => c.id === card.id ? {...c, title: e.target.value} : c))} />
                    </div>
                    <div>
                      <Label>Card Content</Label>
                      <Textarea value={card.content} onChange={e => setTeachCards(teachCards.map(c => c.id === card.id ? {...c, content: e.target.value} : c))} rows={3} />
                    </div>
                    {idx === 2 && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <Label>Link Text (Optional)</Label>
                          <Input value={card.link_text || ""} onChange={e => setTeachCards(teachCards.map(c => c.id === card.id ? {...c, link_text: e.target.value} : c))} />
                        </div>
                        <div>
                          <Label>Link URL</Label>
                          <Input value={card.link_url || ""} onChange={e => setTeachCards(teachCards.map(c => c.id === card.id ? {...c, link_url: e.target.value} : c))} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={() => saveTeachingMutation.mutate()} disabled={saveTeachingMutation.isPending}>
                {saveTeachingMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Teaching Method Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
