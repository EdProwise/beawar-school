import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AdmissionInquiry {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  message: string | null;
  status: string;
  created_at: string;
}

const AdminAdmissions = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-admissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdmissionInquiry[];
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-yellow-100 text-yellow-700";
      case "contacted": return "bg-blue-100 text-blue-700";
      case "scheduled": return "bg-purple-100 text-purple-700";
      case "enrolled": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Admission Inquiries</h1>
          <p className="text-muted-foreground">View and manage admission inquiry submissions</p>
        </div>

        {/* Inquiries */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No admission inquiries yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Parent Name</th>
                    <th className="text-left p-4 font-medium text-foreground">Contact</th>
                    <th className="text-left p-4 font-medium text-foreground">Grade</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{item.parent_name}</p>
                        {item.message && (
                          <p className="text-sm text-muted-foreground mt-1 max-w-xs truncate">{item.message}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" /> {item.email}
                          </p>
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" /> {item.phone}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {item.grade_applying}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(item.status))}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAdmissions;
