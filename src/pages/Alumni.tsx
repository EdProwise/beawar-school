import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Search, UserPlus, Send, Camera, Sparkles } from "lucide-react";
import { AlumniCard } from "@/components/ui/alumni-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AlumniProfile {
  id: string;
  name: string;
  batch: string;
  image: string;
  designation: string;
  company?: string;
  location?: string;
  bio: string;
  is_featured: boolean;
  is_approved?: boolean;
}

export default function Alumni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    designation: "",
    company: "",
    location: "",
    bio: "",
    image: ""
  });

  const { data: alumniProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["alumni_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alumni_profiles").select("*").order("name", { ascending: true });
      if (error) throw error;
      return data as AlumniProfile[];
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (newData: any) => {
      const { error } = await supabase.from("alumni_profiles").insert([{ 
        ...newData, 
        is_featured: false,
        is_approved: false 
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni_profiles"] });
      setIsJoinDialogOpen(false);
      setFormData({ name: "", batch: "", designation: "", company: "", location: "", bio: "", image: "" });
      toast({
        title: "Registration Submitted!",
        description: "Your profile has been submitted for review. It will be visible once approved by the admin.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `alumni/${fileName}`;

      const { data, error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
      setFormData(prev => ({ ...prev, image: publicUrl }));
      toast({ title: "Photo uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.batch || !formData.designation) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    registrationMutation.mutate(formData);
  };

  const approvedProfiles = alumniProfiles?.filter(profile => profile.is_approved !== false);

  const filteredProfiles = approvedProfiles?.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.batch.includes(searchQuery) ||
    profile.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProfiles = approvedProfiles?.filter(p => p.is_featured);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
            <div className="grid grid-cols-8 gap-4 h-full transform -skew-y-12 translate-y-20">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg h-32 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-md border border-white/20 uppercase tracking-widest">
                Alumni Network
              </span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                Legends Never Graduate
              </h1>
              <p className="text-indigo-100/90 text-xl max-w-3xl mx-auto leading-relaxed mb-10">
                A global community of achievers, dreamers, and leaders. Connect, collaborate, and continue the legacy.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setIsJoinDialogOpen(true)}
                  className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 h-14 text-lg rounded-full"
                >
                  Join the Network
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white border-white/30 hover:bg-white/10 font-bold px-8 h-14 text-lg rounded-full backdrop-blur-sm"
                >
                  Explore Stories
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Alumni */}
        {featuredProfiles && featuredProfiles.length > 0 && (
          <section className="py-24 bg-white border-b border-slate-100">
            <div className="container">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Distinguished Alumni</h2>
                  <p className="text-slate-500 text-lg">Celebrating the remarkable achievements of our graduates.</p>
                </div>
              </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProfiles.map((profile, idx) => (
                    <AlumniCard 
                      key={profile.id} 
                      profile={profile} 
                      variant="featured" 
                      index={idx} 
                    />
                  ))}
                </div>
            </div>
          </section>
        )}

        {/* Search & Directory */}
        <section id="directory" className="py-24 bg-slate-50">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Alumni Directory</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, batch, or profession..."
                  className="pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:ring-indigo-500 shadow-sm bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {profilesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
              </div>
              ) : filteredProfiles && filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProfiles.map((profile, idx) => (
                    <AlumniCard 
                      key={profile.id} 
                      profile={profile} 
                      variant="standard" 
                      index={idx} 
                    />
                  ))}
                </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <UserPlus className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-slate-900">No members found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or be the first to join!</p>
              </div>
            )}
          </div>
        </section>

        {/* Join CTA Section */}
        <section className="py-24 bg-indigo-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 text-center">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">Are you an Orbit Alumnus?</h2>
              <p className="text-indigo-100 text-xl mb-10 leading-relaxed">
                Join our exclusive network to mentor students, attend reunions, and connect with fellow graduates worldwide.
              </p>
              <Button 
                size="lg" 
                onClick={() => setIsJoinDialogOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-12 h-16 text-xl rounded-full shadow-2xl shadow-amber-500/20"
              >
                Join the Network Today
              </Button>
            </div>
          </div>
        </section>

        {/* Join Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent className="max-w-lg rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-slate-900">Join the Network</DialogTitle>
              <DialogDescription className="text-lg">
                Tell us about your journey since graduation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoinSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name*</Label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="rounded-xl border-slate-200" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch (Year)*</Label>
                  <Input 
                    required 
                    value={formData.batch} 
                    onChange={e => setFormData({...formData, batch: e.target.value})} 
                    className="rounded-xl border-slate-200" 
                    placeholder="2018" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Designation*</Label>
                <Input 
                  required 
                  value={formData.designation} 
                  onChange={e => setFormData({...formData, designation: e.target.value})} 
                  className="rounded-xl border-slate-200" 
                  placeholder="Senior Consultant" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})} 
                    className="rounded-xl border-slate-200" 
                    placeholder="Microsoft" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    className="rounded-xl border-slate-200" 
                    placeholder="London, UK" 
                  />
                </div>
              </div>
                <div className="space-y-2">
                  <Label>Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 relative group">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-400" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 mb-2">
                        {uploading ? "Uploading..." : "Click to upload your professional headshot"}
                      </p>
                      {uploading && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>A Short Bio / Achievement</Label>
                <Textarea 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                  className="rounded-xl border-slate-200 h-24" 
                  placeholder="Briefly describe your path after school..." 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={registrationMutation.isPending}
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                >
                  {registrationMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  Register Profile
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
