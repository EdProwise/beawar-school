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
import { supabase } from "@/integrations/mongodb/client";
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
  
    const { data: newsletterCount = 0 } = useQuery({
      queryKey: ["admin-newsletter-count"],
      queryFn: async () => {
        const { count } = await supabase.from("newsletter_subscriptions").select("*", { count: "exact", head: true });
        return count || 0;
      },
    });

    // Fetch recent activities
  
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
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
