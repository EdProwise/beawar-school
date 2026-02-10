import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Download, Briefcase, Mail, Phone, Calendar, GraduationCap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CareerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  qualification: string;
  message: string;
  cv_url: string;
  status: string;
  created_at: string;
  createdAt: string;
}

export default function AdminCareer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["admin-career-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("career_applications")
        .select("*")
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data as CareerApplication[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("career_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-career-applications"] });
      toast({ title: "Application deleted" });
    },
    onError: () => toast({ title: "Error deleting", variant: "destructive" }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("career_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-career-applications"] });
      toast({ title: "Status updated" });
    },
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "reviewed": return "bg-blue-100 text-blue-700";
      case "shortlisted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
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
        <h1 className="text-3xl font-bold text-foreground">Career Applications</h1>
        <p className="text-muted-foreground">View and manage career applications submitted by candidates</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground">Career applications will appear here when candidates apply.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-foreground">{app.full_name}</h3>
                    <Badge className={statusColor(app.status)}>{app.status}</Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0" />
                      <a href={`mailto:${app.email}`} className="hover:text-primary truncate">{app.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <a href={`tel:${app.phone}`} className="hover:text-primary">{app.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span>{app.position}</span>
                    </div>
                    {app.experience && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{app.experience}</span>
                      </div>
                    )}
                    {app.qualification && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="w-4 h-4 shrink-0" />
                        <span>{app.qualification}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{new Date(app.createdAt || app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  {app.message && (
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">{app.message}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {app.cv_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={app.cv_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-1" />
                        CV
                      </a>
                    </Button>
                  )}
                  <select
                    value={app.status}
                    onChange={(e) => updateStatusMutation.mutate({ id: app.id, status: e.target.value })}
                    className="text-xs border border-border rounded-md px-2 py-1.5 bg-background"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Delete this application?")) {
                        deleteMutation.mutate(app.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
