import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/mongodb/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Download, Briefcase, Mail, Phone, Calendar, GraduationCap, Clock, Search, X } from "lucide-react";
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

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterQualification, setFilterQualification] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

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

  const uniquePositions = useMemo(
    () => [...new Set(applications.map((a) => a.position).filter(Boolean))].sort(),
    [applications]
  );

  const uniqueQualifications = useMemo(
    () => [...new Set(applications.map((a) => a.qualification).filter(Boolean))].sort(),
    [applications]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return applications.filter((app) => {
      const matchesSearch =
        !q ||
        app.full_name?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.phone?.includes(q) ||
        app.position?.toLowerCase().includes(q) ||
        app.qualification?.toLowerCase().includes(q);
      const matchesStatus = !filterStatus || app.status === filterStatus;
      const matchesQualification = !filterQualification || app.qualification === filterQualification;
      const matchesPosition = !filterPosition || app.position === filterPosition;
      return matchesSearch && matchesStatus && matchesQualification && matchesPosition;
    });
  }, [applications, search, filterStatus, filterQualification, filterPosition]);

  const hasFilters = !!(search || filterStatus || filterQualification || filterPosition);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterQualification("");
    setFilterPosition("");
  };

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Career Applications</h1>
        <p className="text-muted-foreground">View and manage career applications submitted by candidates</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-2 bg-background min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>

            <select
              value={filterQualification}
              onChange={(e) => setFilterQualification(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-2 bg-background w-[160px] shrink-0"
            >
            <option value="">All Qualifications</option>
            {uniqueQualifications.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-2 bg-background min-w-[160px]"
          >
            <option value="">All Positions</option>
            {uniquePositions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            <span className="font-semibold text-foreground">{applications.length}</span> applications
          </span>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 gap-1 text-xs">
              <X className="w-3 h-3" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {applications.length === 0 ? "No Applications Yet" : "No Matching Applications"}
          </h3>
          <p className="text-muted-foreground">
            {applications.length === 0
              ? "Career applications will appear here when candidates apply."
              : "Try adjusting your search or filters."}
          </p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
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
                      <span>
                        {new Date(app.createdAt || app.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
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
