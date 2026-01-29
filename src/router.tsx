import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Extracurricular from "./pages/Extracurricular";
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
import Curriculum from "./pages/Curriculum";
import TeachingMethod from "./pages/TeachingMethod";
import Results from "./pages/Results";
import Alumni from "./pages/Alumni";
import BeyondAcademics from "./pages/BeyondAcademics";
import EntrepreneurSkills from "./pages/EntrepreneurSkills";
import ResidentialSchool from "./pages/ResidentialSchool";
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
import AdminExtracurricular from "./pages/admin/AdminExtracurricular";
import AdminHighlights from "./pages/admin/AdminHighlights";
import AdminScrollWords from "./pages/admin/AdminScrollWords";
import AdminAdmissionsContent from "./pages/admin/AdminAdmissionsContent";
import AdminFeesStructure from "./pages/admin/AdminFeesStructure";
import AdminLegalPages from "./pages/admin/AdminLegalPages";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminCurriculum from "./pages/admin/AdminCurriculum";
import AdminTeachingMethod from "./pages/admin/AdminTeachingMethod";
import AdminResults from "./pages/admin/AdminResults";
import AdminAlumni from "./pages/admin/AdminAlumni";
import AdminBeyondAcademics from "./pages/admin/AdminBeyondAcademics";

import AdminCurriculumAndTeaching from "./pages/admin/AdminCurriculumAndTeaching";

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
      path: "/curriculum",
      name: 'curriculum',
      element: <Curriculum />,
    },
    {
      path: "/teaching-method",
      name: 'teaching-method',
      element: <TeachingMethod />,
    },
    {
      path: "/results",
      name: 'results',
      element: <Results />,
    },
    {
      path: "/alumni",
      name: 'alumni',
      element: <Alumni />,
    },
    {
      path: "/beyond-academics",
      name: 'beyond-academics',
      element: <BeyondAcademics />,
    },
    {
      path: "/beyond-academics/entrepreneur-skills",
      name: 'entrepreneur-skills',
      element: <EntrepreneurSkills />,
    },
    {
      path: "/beyond-academics/residential-school",
      name: 'residential-school',
      element: <ResidentialSchool />,
    },
    {
      path: "/extracurricular",
      name: 'extracurricular',
      element: <Extracurricular />,
    },
    {
      path: "/admissions",
      name: 'admissions',
      element: <Admissions />,
    },
    {
      path: "/infrastructure",
      name: 'infrastructure',
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
          path: "/admin/extracurricular",
          name: 'admin-extracurricular',
          element: <AdminExtracurricular />,
        },
          {
            path: "/admin/highlights",

            name: 'admin-highlights',
            element: <AdminHighlights />,
          },
            {
              path: "/admin/curriculum-teaching",
              name: 'admin-curriculum-teaching',
              element: <AdminCurriculumAndTeaching />,
            },
            {
              path: "/admin/curriculum",
              name: 'admin-curriculum',
              element: <AdminCurriculum />,
            },
          {
            path: "/admin/teaching-method",
            name: 'admin-teaching-method',
            element: <AdminTeachingMethod />,
          },
          {
            path: "/admin/results-manage",
            name: 'admin-results',
            element: <AdminResults />,
          },
          {
            path: "/admin/alumni-manage",
            name: 'admin-alumni',
            element: <AdminAlumni />,
          },
          {
            path: "/admin/beyond-academics",
            name: 'admin-beyond-academics',
            element: <AdminBeyondAcademics />,
          },
          {
            path: "/admin/scroll-words",

          name: 'admin-scroll-words',
          element: <AdminScrollWords />,
        },
      {
        path: "/admin/admission-process",
        name: 'admin-admission-process',
        element: <AdminAdmissionsContent />,
      },
      {
        path: "/admin/fees-structure",
        name: 'admin-fees-structure',
        element: <AdminFeesStructure />,
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
