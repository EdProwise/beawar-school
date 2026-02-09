// SEO route metadata for server-side meta tag injection
const SITE_NAME = "PRJ GyanJaya";
const SITE_URL = "https://beawarschool.com";

interface RouteMeta {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
}

const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: `${SITE_NAME} - Excellence in Education`,
    description: "PRJ GyanJaya offers quality education with modern facilities, experienced faculty, and a nurturing environment for students to excel academically and beyond.",
    keywords: "PRJ GyanJaya, school in Beawar, education, academics, admissions",
  },
  "/about-us": {
    title: `About Us | ${SITE_NAME}`,
    description: "Learn about PRJ GyanJaya - our history, mission, vision, and the values that drive excellence in education.",
    keywords: "about PRJ GyanJaya, school history, mission, vision, values",
  },
  "/our-teams": {
    title: `Our Team | ${SITE_NAME}`,
    description: "Meet the dedicated teachers and staff at PRJ GyanJaya who are committed to providing quality education.",
    keywords: "school team, teachers, faculty, staff, PRJ GyanJaya",
  },
  "/our-branches": {
    title: `Our Branches | ${SITE_NAME}`,
    description: "Explore the various branches of PRJ GyanJaya across locations. Find a campus near you.",
    keywords: "school branches, campuses, PRJ GyanJaya locations",
  },
  "/academics": {
    title: `Academics | ${SITE_NAME}`,
    description: "Discover the academic programs and curriculum at PRJ GyanJaya designed to nurture young minds.",
    keywords: "academics, programs, curriculum, PRJ GyanJaya education",
  },
  "/curriculum": {
    title: `Curriculum | ${SITE_NAME}`,
    description: "Explore the comprehensive curriculum at PRJ GyanJaya covering all subjects and grade levels.",
    keywords: "school curriculum, syllabus, subjects, PRJ GyanJaya",
  },
  "/teaching-method": {
    title: `Teaching Methods | ${SITE_NAME}`,
    description: "Learn about the innovative teaching methods and pedagogical approaches at PRJ GyanJaya.",
    keywords: "teaching methods, pedagogy, learning approach, PRJ GyanJaya",
  },
  "/results": {
    title: `Results | ${SITE_NAME}`,
    description: "View the outstanding academic results and achievements of students at PRJ GyanJaya.",
    keywords: "school results, academic performance, student achievements",
  },
  "/alumni": {
    title: `Alumni | ${SITE_NAME}`,
    description: "Connect with the alumni network of PRJ GyanJaya and see where our graduates are making an impact.",
    keywords: "alumni, graduates, school alumni, PRJ GyanJaya",
  },
  "/beyond-academics": {
    title: `Beyond Academics | ${SITE_NAME}`,
    description: "Discover extracurricular and co-curricular activities at PRJ GyanJaya for holistic development.",
    keywords: "beyond academics, activities, holistic education, PRJ GyanJaya",
  },
  "/beyond-academics/entrepreneur-skills": {
    title: `Entrepreneur Skills | ${SITE_NAME}`,
    description: "Explore the entrepreneurship and skill development programs at PRJ GyanJaya for future leaders.",
    keywords: "entrepreneur skills, skill development, leadership, PRJ GyanJaya",
  },
  "/beyond-academics/residential-school": {
    title: `Residential School | ${SITE_NAME}`,
    description: "Learn about the residential school facilities and boarding life at PRJ GyanJaya.",
    keywords: "residential school, boarding, hostel, PRJ GyanJaya",
  },
  "/extracurricular": {
    title: `Extracurricular Activities | ${SITE_NAME}`,
    description: "Explore the wide range of extracurricular activities offered at PRJ GyanJaya.",
    keywords: "extracurricular, sports, arts, clubs, PRJ GyanJaya",
  },
  "/admissions/process": {
    title: `Admission Process | ${SITE_NAME}`,
    description: "Everything you need to know about the admission process, requirements, and enrollment at PRJ GyanJaya.",
    keywords: "admission process, enrollment, apply, PRJ GyanJaya admissions",
  },
  "/admissions/fees-structure": {
    title: `Fees Structure | ${SITE_NAME}`,
    description: "View the transparent fees structure and payment options at PRJ GyanJaya.",
    keywords: "fees structure, school fees, tuition, PRJ GyanJaya",
  },
  "/infrastructure": {
    title: `Infrastructure & Facilities | ${SITE_NAME}`,
    description: "Explore the modern infrastructure and world-class facilities available at PRJ GyanJaya.",
    keywords: "school facilities, infrastructure, campus, PRJ GyanJaya",
  },
  "/gallery": {
    title: `Gallery | ${SITE_NAME}`,
    description: "Browse photos and videos from events, activities, and campus life at PRJ GyanJaya.",
    keywords: "school gallery, photos, events, campus, PRJ GyanJaya",
  },
  "/news": {
    title: `News & Events | ${SITE_NAME}`,
    description: "Stay updated with the latest news, events, and announcements from PRJ GyanJaya.",
    keywords: "school news, events, announcements, PRJ GyanJaya",
  },
  "/contact": {
    title: `Contact Us | ${SITE_NAME}`,
    description: "Get in touch with PRJ GyanJaya. Find our address, phone number, email, and inquiry form.",
    keywords: "contact, address, phone, email, PRJ GyanJaya",
  },
  "/students": {
    title: `Student Portal | ${SITE_NAME}`,
    description: "Access the student portal at PRJ GyanJaya for resources, assignments, and more.",
    keywords: "student portal, student login, PRJ GyanJaya",
  },
  "/teachers": {
    title: `Teacher Portal | ${SITE_NAME}`,
    description: "Access the teacher portal at PRJ GyanJaya for resources and management tools.",
    keywords: "teacher portal, teacher login, PRJ GyanJaya",
  },
  "/parents": {
    title: `Parent Portal | ${SITE_NAME}`,
    description: "Access the parent portal at PRJ GyanJaya to track your child's progress.",
    keywords: "parent portal, parent login, PRJ GyanJaya",
  },
  "/privacy": {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "Read the privacy policy of PRJ GyanJaya regarding data collection and protection.",
    keywords: "privacy policy, data protection, PRJ GyanJaya",
  },
  "/terms": {
    title: `Terms & Conditions | ${SITE_NAME}`,
    description: "Read the terms and conditions for using PRJ GyanJaya website and services.",
    keywords: "terms and conditions, terms of use, PRJ GyanJaya",
  },
};

const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'discordbot',
];

export function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

export function getMetaForRoute(pathname: string): RouteMeta {
  // Exact match
  if (routeMeta[pathname]) return routeMeta[pathname];
  
  // News detail pages
  if (pathname.startsWith('/news/')) {
    return {
      title: `News Article | ${SITE_NAME}`,
      description: "Read the latest news and updates from PRJ GyanJaya.",
      keywords: "news, school news, PRJ GyanJaya",
      ogType: "article",
    };
  }
  
  // Default
  return {
    title: SITE_NAME,
    description: "PRJ GyanJaya - Excellence in Education",
  };
}

export function injectMetaTags(html: string, pathname: string): string {
  const meta = getMetaForRoute(pathname);
  const canonicalUrl = `${SITE_URL}${pathname}`;
  const ogType = meta.ogType || "website";
  
  // Build structured data
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    image: `${SITE_URL}/hero_campus.png`,
    sameAs: [
      "https://www.facebook.com/beawarschool",
      "https://www.instagram.com/beawarschool",
      "https://www.youtube.com/@beawarschool",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: "+91-1462-XXXXXX",
      email: "info@beawarschool.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Beawar",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
  });

  const ogImage = `${SITE_URL}/hero_campus.png`;

  const metaTags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    ${meta.keywords ? `<meta name="keywords" content="${meta.keywords}" />` : ''}
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${jsonLd}</script>`;

  // Replace the existing title and add meta tags before </head>
  let result = html.replace(/<title>.*?<\/title>/, '');
  result = result.replace('</head>', `${metaTags}\n</head>`);
  
  return result;
}
