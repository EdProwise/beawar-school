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
      Shield,
      FolderOpen,
      Zap
    } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path?: string;
  icon: any;
  children?: { name: string; path: string; icon: any }[];
}

  const navItems: NavItem[] = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    {
      name: "About Content",
      icon: Info,
      children: [
        { name: "About & Branches", path: "/admin/about", icon: Info },
        { name: "Our Teams", path: "/admin/teams", icon: Users },
      ]
    },
      {
        name: "Academics",
      icon: GraduationCap,
        children: [
          { name: "Academic Programs", path: "/admin/programs", icon: FileText },
          { name: "Why Choose Us", path: "/admin/academics", icon: Star },
          { name: "Curriculum & Teaching", path: "/admin/curriculum-teaching", icon: BookOpen },
          { name: "Teaching Method", path: "/admin/teaching-method", icon: BookOpen },
          { name: "Results", path: "/admin/results-manage", icon: BarChart3 },
          { name: "Alumni", path: "/admin/alumni-manage", icon: Users },
        ]
    },
    { 
      name: "Beyond Academics", 
      icon: Zap,
      children: [
        { name: "Beyond Academics", path: "/admin/beyond-academics", icon: Zap },
        { name: "Entrepreneur Skills", path: "/admin/beyond-academics?tab=entrepreneur-skills", icon: Star },
        { name: "Residential School", path: "/admin/beyond-academics?tab=residential-school", icon: Building },
      ]
    },
    { name: "Scroll Words", path: "/admin/scroll-words", icon: Layers },
    {
      name: "Admission",
      icon: ClipboardList,
      children: [
        { name: "Admission Process", path: "/admin/admission-process", icon: FileText },
        { name: "Fees Structure", path: "/admin/fees-structure", icon: BarChart3 },
      ]
    },
    { name: "Infrastructure", path: "/admin/facilities-manage", icon: Building },
  { name: "Gallery", path: "/admin/gallery", icon: Image },
  { name: "News & Events", path: "/admin/news", icon: Newspaper },
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Site Settings", path: "/admin/settings", icon: Settings },
        { name: "Offers", path: "/admin/offers", icon: Star },
        { name: "Hero Slides", path: "/admin/hero-slides", icon: Layers },
      { name: "Statistics", path: "/admin/statistics", icon: BarChart3 },
      { name: "Highlights", path: "/admin/highlights", icon: Star },
      { name: "Newsletter", path: "/admin/newsletter", icon: Bell },
      { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
      { name: "Legal Pages", path: "/admin/legal", icon: Shield },
      { name: "Media Library", path: "/admin/media", icon: FolderOpen },
    ]
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Track open state for each menu item with children
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children) {
        const isActive = item.children.some(c => location.pathname === c.path);
        initialState[item.name] = isActive;
      }
    });
    return initialState;
  });

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };


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
              <div className="w-10 h-10 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-foreground" />
              </div>
                <div>
                  <p className="font-heading font-bold text-primary">Orbit School</p>
                  <p className="text-xs text-primary">Admin Panel</p>
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
            if (item.children) {
              const hasActiveChild = item.children.some(c => location.pathname === c.path);
              
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        hasActiveChild
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </div>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", openMenus[item.name] && "rotate-180")} />
                    </button>
                    
                    {openMenus[item.name] && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => {
                          const isActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              <child.icon className="w-4 h-4" />
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }


            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path!}
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
            {(() => {
              const activeItem = navItems.find((item) => item.path === location.pathname);
              if (activeItem) return activeItem.name;
              
              const activeChild = navItems
                .flatMap(item => item.children || [])
                .find(child => child.path === location.pathname);
              if (activeChild) return activeChild.name;
              
              return "Dashboard";
            })()}
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
