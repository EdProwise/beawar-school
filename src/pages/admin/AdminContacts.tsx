import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Eye, Check, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminContacts = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
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
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "read": return "bg-blue-100 text-blue-700";
      case "replied": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground">View and manage contact form submissions</p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
              No contact messages yet.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">{item.full_name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" /> {item.email}
                      </span>
                      {item.phone && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" /> {item.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(item.status))}>
                      {item.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-primary">{item.subject}</p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
