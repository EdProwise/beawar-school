import { useQuery } from "@tanstack/react-query";
import { Mail, Loader2, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterSubscription {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const AdminNewsletter = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as NewsletterSubscription[];
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

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Status,Subscribed Date\n"
      + items.map(item => `${item.email},${item.is_active ? 'Active' : 'Inactive'},${formatDate(item.created_at)}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Newsletter Subscribers</h1>
            <p className="text-muted-foreground">
              {items.length} total subscribers
            </p>
          </div>
          {items.length > 0 && (
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No newsletter subscribers yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">#</th>
                    <th className="text-left p-4 font-medium text-foreground">Email</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4 text-muted-foreground text-sm">
                        {index + 1}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-foreground">
                          <Mail className="w-4 h-4 text-primary" />
                          {item.email}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {item.is_active ? "Active" : "Inactive"}
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

export default AdminNewsletter;
