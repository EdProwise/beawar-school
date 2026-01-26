import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Newspaper, 
  Image, 
  MessageSquare, 
  Users, 
  Mail, 
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
  Layers,
  BarChart3,
  Building,
  BookOpen,
  Info,
  Star,
  FileText,
  ClipboardList,
  UserCircle,
  Shield,
  FolderOpen
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Admission Inquiries", path: "/admin/admissions", icon: Users },
  { name: "Contact Message", path: "/admin/contacts", icon: Mail },
  { name: "About Content", path: "/admin/about", icon: Info },
  { name: "Academic", path: "/admin/programs", icon: BookOpen },
  { name: "Academic Content", path: "/admin/academics", icon: FileText },
  { name: "Admission", path: "/admin/admissions-content", icon: ClipboardList },
  { name: "Facilities", path: "/admin/facilities-manage", icon: Building },
  { name: "Gallery", path: "/admin/gallery", icon: Image },
  { name: "News & Events", path: "/admin/news", icon: Newspaper },
  { name: "Hero Slides", path: "/admin/hero-slides", icon: Layers },
  { name: "Statistics", path: "/admin/statistics", icon: BarChart3 },
  { name: "Highlights", path: "/admin/highlights", icon: Star },
  { name: "Site Settings", path: "/admin/settings", icon: Settings },
  { name: "Portal", path: "/admin/portals", icon: UserCircle },
  { name: "Media Library", path: "/admin/media", icon: FolderOpen },
  { name: "Newsletter", path: "/admin/newsletter", icon: Bell },
  { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
  { name: "Legal Pages", path: "/admin/legal", icon: Shield },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-secondary/50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground">Orbit School</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to Website - Fixed at bottom */}
        <div className="p-4 border-t border-border shrink-0">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/">View Website</Link>
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="font-heading font-semibold text-foreground hidden lg:block">
            {navItems.find((item) => item.path === location.pathname)?.name || "Dashboard"}
          </h1>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {profile?.full_name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg border border-border shadow-lg z-50">
                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
