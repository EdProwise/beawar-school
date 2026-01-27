import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Parents from "./pages/Parents";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHeroSlides from "./pages/admin/AdminHeroSlides";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminFacilitiesManage from "./pages/admin/AdminFacilitiesManage";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminAcademics from "./pages/admin/AdminAcademics";
import AdminHighlights from "./pages/admin/AdminHighlights";
import AdminAdmissionsContent from "./pages/admin/AdminAdmissionsContent";
import AdminLegalPages from "./pages/admin/AdminLegalPages";
import AdminMedia from "./pages/admin/AdminMedia";

export const routers = [
    {
      path: "/",
      name: 'home',
      element: <Index />,
    },
    {
      path: "/about",
      name: 'about',
      element: <About />,
    },
    {
      path: "/academics",
      name: 'academics',
      element: <Academics />,
    },
    {
      path: "/admissions",
      name: 'admissions',
      element: <Admissions />,
    },
    {
      path: "/facilities",
      name: 'facilities',
      element: <Facilities />,
    },
    {
      path: "/gallery",
      name: 'gallery',
      element: <Gallery />,
    },
      {
        path: "/news",
        name: 'news',
        element: <News />,
      },
      {
        path: "/news/:slug",
        name: 'news-detail',
        element: <NewsDetail />,
      },
      {
        path: "/contact",

      name: 'contact',
      element: <Contact />,
    },
    {
      path: "/students",
      name: 'students',
      element: <Students />,
    },
    {
      path: "/teachers",
      name: 'teachers',
      element: <Teachers />,
    },
    {
      path: "/parents",
      name: 'parents',
      element: <Parents />,
    },
    {
      path: "/privacy",
      name: 'privacy',
      element: <Privacy />,
    },
    {
      path: "/terms",
      name: 'terms',
      element: <Terms />,
    },
    // Admin Routes
    {
      path: "/admin/login",
      name: 'admin-login',
      element: <AdminLogin />,
    },
    {
      path: "/admin/register",
      name: 'admin-register',
      element: <AdminRegister />,
    },
    {
      path: "/admin/dashboard",
      name: 'admin-dashboard',
      element: <AdminDashboard />,
    },
    {
      path: "/admin/news",
      name: 'admin-news',
      element: <AdminNews />,
    },
    {
      path: "/admin/gallery",
      name: 'admin-gallery',
      element: <AdminGallery />,
    },
    {
      path: "/admin/testimonials",
      name: 'admin-testimonials',
      element: <AdminTestimonials />,
    },
    {
      path: "/admin/admissions",
      name: 'admin-admissions',
      element: <AdminAdmissions />,
    },
    {
      path: "/admin/contacts",
      name: 'admin-contacts',
      element: <AdminContacts />,
    },
    {
      path: "/admin/newsletter",
      name: 'admin-newsletter',
      element: <AdminNewsletter />,
    },
    {
      path: "/admin/settings",
      name: 'admin-settings',
      element: <AdminSettings />,
    },
    {
      path: "/admin/hero-slides",
      name: 'admin-hero-slides',
      element: <AdminHeroSlides />,
    },
    {
      path: "/admin/statistics",
      name: 'admin-statistics',
      element: <AdminStatistics />,
    },
    {
      path: "/admin/facilities-manage",
      name: 'admin-facilities-manage',
      element: <AdminFacilitiesManage />,
    },
    {
      path: "/admin/programs",
      name: 'admin-programs',
      element: <AdminPrograms />,
    },
      {
        path: "/admin/about",
        name: 'admin-about',
        element: <AdminAbout />,
      },
      {
        path: "/admin/academics",
        name: 'admin-academics',
        element: <AdminAcademics />,
      },
      {
        path: "/admin/highlights",
        name: 'admin-highlights',
        element: <AdminHighlights />,
      },

    {
      path: "/admin/admissions-content",
      name: 'admin-admissions-content',
      element: <AdminAdmissionsContent />,
    },
    {
      path: "/admin/legal",
      name: 'admin-legal',
      element: <AdminLegalPages />,
    },
    {
      path: "/admin/media",
      name: 'admin-media',
      element: <AdminMedia />,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
