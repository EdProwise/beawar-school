import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Newspaper, 
  Image, 
  MessageSquare, 
  Users, 
  Mail, 
  Bell,
  TrendingUp,
  Eye
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  link: string;
}

function StatCard({ title, value, icon: Icon, color, link }: StatCardProps) {
  return (
    <Link
      to={link}
      className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-1">{title}</p>
          <p className="font-heading text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Link>
  );
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch counts
  const { data: newsCount = 0 } = useQuery({
    queryKey: ["admin-news-count"],
    queryFn: async () => {
      const { count } = await supabase.from("news_events").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: galleryCount = 0 } = useQuery({
    queryKey: ["admin-gallery-count"],
    queryFn: async () => {
      const { count } = await supabase.from("gallery_items").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: testimonialCount = 0 } = useQuery({
    queryKey: ["admin-testimonial-count"],
    queryFn: async () => {
      const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: admissionCount = 0 } = useQuery({
    queryKey: ["admin-admission-count"],
    queryFn: async () => {
      const { count } = await supabase.from("admission_inquiries").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: contactCount = 0 } = useQuery({
    queryKey: ["admin-contact-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: newsletterCount = 0 } = useQuery({
    queryKey: ["admin-newsletter-count"],
    queryFn: async () => {
      const { count } = await supabase.from("newsletter_subscriptions").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  // Fetch recent activities
  const { data: recentContacts = [] } = useQuery({
    queryKey: ["admin-recent-contacts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: recentAdmissions = [] } = useQuery({
    queryKey: ["admin-recent-admissions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admission_inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    { title: "News & Events", value: newsCount, icon: Newspaper, color: "bg-primary", link: "/admin/news" },
    { title: "Gallery Items", value: galleryCount, icon: Image, color: "bg-green-500", link: "/admin/gallery" },
    { title: "Testimonials", value: testimonialCount, icon: MessageSquare, color: "bg-blue-500", link: "/admin/testimonials" },
    { title: "Admission Inquiries", value: admissionCount, icon: Users, color: "bg-orange-500", link: "/admin/admissions" },
    { title: "Contact Messages", value: contactCount, icon: Mail, color: "bg-pink-500", link: "/admin/contacts" },
    { title: "Newsletter Subs", value: newsletterCount, icon: Bell, color: "bg-accent", link: "/admin/newsletter" },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-heading text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-primary-foreground/80">
            Manage your school website content, view inquiries, and monitor performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Recent Contact Messages
              </h2>
              <Link to="/admin/contacts" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact: { id: string; full_name: string; subject: string; created_at: string }) => (
                  <div key={contact.id} className="p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{contact.full_name}</p>
                        <p className="text-sm text-muted-foreground">{contact.subject}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(contact.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No messages yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Admissions */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Recent Admission Inquiries
              </h2>
              <Link to="/admin/admissions" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentAdmissions.length > 0 ? (
                recentAdmissions.map((admission: { id: string; parent_name: string; grade_applying: string; created_at: string }) => (
                  <div key={admission.id} className="p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{admission.parent_name}</p>
                        <p className="text-sm text-muted-foreground">Grade: {admission.grade_applying}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(admission.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No inquiries yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/news"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <Newspaper className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Add News</p>
            </Link>
            <Link
              to="/admin/gallery"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <Image className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-foreground">Add to Gallery</p>
            </Link>
            <Link
              to="/admin/testimonials"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-foreground">Add Testimonial</p>
            </Link>
            <Link
              to="/"
              target="_blank"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <Eye className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-medium text-foreground">View Website</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
