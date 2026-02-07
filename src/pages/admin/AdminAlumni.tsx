import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, GraduationCap, Star, Search, UserPlus, X, Upload, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface AlumniProfile {
  id?: string;
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

export default function AdminAlumni() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileSearch, setProfileSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");
  
  // Profiles Data
  const { data: profilesData, isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-alumni-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alumni_profiles").select("*").order("name", { ascending: true });
      if (error) throw error;
      return data as AlumniProfile[];
    }
  });

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AlumniProfile | null>(null);
  const [uploading, setUploading] = useState(false);

  // Profile Mutations
  const saveProfileMutation = useMutation({
    mutationFn: async (profile: AlumniProfile) => {
      if (profile.id) {
        const { id, ...rest } = profile;
        const { error } = await supabase.from("alumni_profiles").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("alumni_profiles").insert([{
          ...profile,
          is_approved: profile.is_approved ?? true // Default to true if created by admin
        }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-alumni-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alumni_profiles"] });
      setIsProfileDialogOpen(false);
      setEditingProfile(null);
      toast({ title: "Profile saved successfully" });
    },
    onError: (err: any) => toast({ title: "Error saving profile", description: err.message, variant: "destructive" })
  });

  const approveProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alumni_profiles").update({ is_approved: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-alumni-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alumni_profiles"] });
      toast({ title: "Profile approved successfully" });
    }
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alumni_profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-alumni-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alumni_profiles"] });
      toast({ title: "Profile deleted" });
    }
  });

  const filteredProfiles = profilesData?.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
                        profile.batch.includes(profileSearch);
    const matchesStatus = statusFilter === "all" || 
                        (statusFilter === "pending" && profile.is_approved === false) ||
                        (statusFilter === "approved" && profile.is_approved === true);
    return matchesSearch && matchesStatus;
  });

  const pendingCount = profilesData?.filter(p => p.is_approved === false).length || 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `alumni/${fileName}`;

      const { data, error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
      setEditingProfile(prev => prev ? { ...prev, image: publicUrl } : null);
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (profilesLoading) {
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alumni Management System</h1>
            <p className="text-muted-foreground">Manage alumni profiles and success stories</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="flex gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search profiles..." 
                  className="pl-9 bg-slate-50 border-none"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                />
              </div>
              <select 
                className="bg-slate-50 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Profiles</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending ({pendingCount})</option>
              </select>
            </div>
            <Button onClick={() => {
              setEditingProfile({
                name: "",
                batch: "",
                image: "",
                designation: "",
                company: "",
                location: "",
                bio: "",
                is_featured: false,
                is_approved: true
              });
              setIsProfileDialogOpen(true);
            }} className="rounded-full px-6 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Alumni
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles?.map((profile) => (
              <Card key={profile.id} className={`group overflow-hidden border-border/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 ${profile.is_approved === false ? 'border-amber-200 bg-amber-50/10' : ''}`}>
                <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <GraduationCap className="w-16 h-16" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {profile.is_featured && (
                      <div className="bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </div>
                    )}
                    {profile.is_approved === false && (
                      <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200 shadow-sm">
                        <Clock className="w-3 h-3" /> Pending Review
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {profile.is_approved === false && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => approveProfileMutation.mutate(profile.id!)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => {
                      setEditingProfile(profile);
                      setIsProfileDialogOpen(true);
                    }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                      if (confirm("Are you sure?")) deleteProfileMutation.mutate(profile.id!);
                    }}>Delete</Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    {profile.is_approved ? (
                      <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-indigo-600 font-semibold mb-3">Class of {profile.batch}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">"{profile.bio}"</p>
                </CardContent>
              </Card>
            ))}
            {(!profilesData || profilesData.length === 0) && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900">No Alumni Profiles</h3>
                <p className="text-slate-500 mt-2">Start building your school's legacy network.</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{editingProfile?.id ? "Edit Profile" : "Add New Alumni"}</DialogTitle>
            </DialogHeader>
            
            {editingProfile && (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-6">
                  <div className="relative group w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 hover:border-primary transition-colors cursor-pointer">
                    {editingProfile.image ? (
                      <>
                        <img src={editingProfile.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button variant="ghost" size="sm" className="text-white" onClick={() => setEditingProfile({ ...editingProfile, image: "" })}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /> : <Upload className="w-6 h-6 mx-auto text-slate-400" />}
                        <span className="text-[10px] text-slate-500 mt-2 block font-medium">Upload Photo</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={editingProfile.name} onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Batch (Year)</Label>
                        <Input value={editingProfile.batch} onChange={e => setEditingProfile({ ...editingProfile, batch: e.target.value })} placeholder="2015" />
                      </div>
                      <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input value={editingProfile.designation} onChange={e => setEditingProfile({ ...editingProfile, designation: e.target.value })} placeholder="Software Engineer" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company (Optional)</Label>
                    <Input value={editingProfile.company || ""} onChange={e => setEditingProfile({ ...editingProfile, company: e.target.value })} placeholder="Google" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location (Optional)</Label>
                    <Input value={editingProfile.location || ""} onChange={e => setEditingProfile({ ...editingProfile, location: e.target.value })} placeholder="New York, USA" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Bio / Achievement</Label>
                  <Textarea value={editingProfile.bio} onChange={e => setEditingProfile({ ...editingProfile, bio: e.target.value })} placeholder="Tell us about their journey..." className="h-24 resize-none" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Featured Alumni</Label>
                    <p className="text-sm text-slate-500">Show this profile on the homepage highlights.</p>
                  </div>
                  <Switch checked={editingProfile.is_featured} onCheckedChange={checked => setEditingProfile({ ...editingProfile, is_featured: checked })} />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => editingProfile && saveProfileMutation.mutate(editingProfile)} 
                disabled={saveProfileMutation.isPending || uploading}
                className="px-8"
              >
                {saveProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {editingProfile?.id ? "Update Profile" : "Create Profile"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
