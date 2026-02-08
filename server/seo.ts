// SEO route metadata for server-side meta tag injection
const SITE_NAME = "Beawar School";
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
    description: "Beawar School offers quality education with modern facilities, experienced faculty, and a nurturing environment for students to excel academically and beyond.",
    keywords: "Beawar School, school in Beawar, education, academics, admissions",
  },
  "/about-us": {
    title: `About Us | ${SITE_NAME}`,
    description: "Learn about Beawar School - our history, mission, vision, and the values that drive excellence in education.",
    keywords: "about Beawar School, school history, mission, vision, values",
  },
  "/our-teams": {
    title: `Our Team | ${SITE_NAME}`,
    description: "Meet the dedicated teachers and staff at Beawar School who are committed to providing quality education.",
    keywords: "school team, teachers, faculty, staff, Beawar School",
  },
  "/our-branches": {
    title: `Our Branches | ${SITE_NAME}`,
    description: "Explore the various branches of Beawar School across locations. Find a campus near you.",
    keywords: "school branches, campuses, Beawar School locations",
  },
  "/academics": {
    title: `Academics | ${SITE_NAME}`,
    description: "Discover the academic programs and curriculum at Beawar School designed to nurture young minds.",
    keywords: "academics, programs, curriculum, Beawar School education",
  },
  "/curriculum": {
    title: `Curriculum | ${SITE_NAME}`,
    description: "Explore the comprehensive curriculum at Beawar School covering all subjects and grade levels.",
    keywords: "school curriculum, syllabus, subjects, Beawar School",
  },
  "/teaching-method": {
    title: `Teaching Methods | ${SITE_NAME}`,
    description: "Learn about the innovative teaching methods and pedagogical approaches at Beawar School.",
    keywords: "teaching methods, pedagogy, learning approach, Beawar School",
  },
  "/results": {
    title: `Results | ${SITE_NAME}`,
    description: "View the outstanding academic results and achievements of students at Beawar School.",
    keywords: "school results, academic performance, student achievements",
  },
  "/alumni": {
    title: `Alumni | ${SITE_NAME}`,
    description: "Connect with the alumni network of Beawar School and see where our graduates are making an impact.",
    keywords: "alumni, graduates, school alumni, Beawar School",
  },
  "/beyond-academics": {
    title: `Beyond Academics | ${SITE_NAME}`,
    description: "Discover extracurricular and co-curricular activities at Beawar School for holistic development.",
    keywords: "beyond academics, activities, holistic education, Beawar School",
  },
  "/beyond-academics/entrepreneur-skills": {
    title: `Entrepreneur Skills | ${SITE_NAME}`,
    description: "Explore the entrepreneurship and skill development programs at Beawar School for future leaders.",
    keywords: "entrepreneur skills, skill development, leadership, Beawar School",
  },
  "/beyond-academics/residential-school": {
    title: `Residential School | ${SITE_NAME}`,
    description: "Learn about the residential school facilities and boarding life at Beawar School.",
    keywords: "residential school, boarding, hostel, Beawar School",
  },
  "/extracurricular": {
    title: `Extracurricular Activities | ${SITE_NAME}`,
    description: "Explore the wide range of extracurricular activities offered at Beawar School.",
    keywords: "extracurricular, sports, arts, clubs, Beawar School",
  },
  "/admissions/process": {
    title: `Admission Process | ${SITE_NAME}`,
    description: "Everything you need to know about the admission process, requirements, and enrollment at Beawar School.",
    keywords: "admission process, enrollment, apply, Beawar School admissions",
  },
  "/admissions/fees-structure": {
    title: `Fees Structure | ${SITE_NAME}`,
    description: "View the transparent fees structure and payment options at Beawar School.",
    keywords: "fees structure, school fees, tuition, Beawar School",
  },
  "/infrastructure": {
    title: `Infrastructure & Facilities | ${SITE_NAME}`,
    description: "Explore the modern infrastructure and world-class facilities available at Beawar School.",
    keywords: "school facilities, infrastructure, campus, Beawar School",
  },
  "/gallery": {
    title: `Gallery | ${SITE_NAME}`,
    description: "Browse photos and videos from events, activities, and campus life at Beawar School.",
    keywords: "school gallery, photos, events, campus, Beawar School",
  },
  "/news": {
    title: `News & Events | ${SITE_NAME}`,
    description: "Stay updated with the latest news, events, and announcements from Beawar School.",
    keywords: "school news, events, announcements, Beawar School",
  },
  "/contact": {
    title: `Contact Us | ${SITE_NAME}`,
    description: "Get in touch with Beawar School. Find our address, phone number, email, and inquiry form.",
    keywords: "contact, address, phone, email, Beawar School",
  },
  "/students": {
    title: `Student Portal | ${SITE_NAME}`,
    description: "Access the student portal at Beawar School for resources, assignments, and more.",
    keywords: "student portal, student login, Beawar School",
  },
  "/teachers": {
    title: `Teacher Portal | ${SITE_NAME}`,
    description: "Access the teacher portal at Beawar School for resources and management tools.",
    keywords: "teacher portal, teacher login, Beawar School",
  },
  "/parents": {
    title: `Parent Portal | ${SITE_NAME}`,
    description: "Access the parent portal at Beawar School to track your child's progress.",
    keywords: "parent portal, parent login, Beawar School",
  },
  "/privacy": {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "Read the privacy policy of Beawar School regarding data collection and protection.",
    keywords: "privacy policy, data protection, Beawar School",
  },
  "/terms": {
    title: `Terms & Conditions | ${SITE_NAME}`,
    description: "Read the terms and conditions for using Beawar School website and services.",
    keywords: "terms and conditions, terms of use, Beawar School",
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
      description: "Read the latest news and updates from Beawar School.",
      keywords: "news, school news, Beawar School",
      ogType: "article",
    };
  }
  
  // Default
  return {
    title: SITE_NAME,
    description: "Beawar School - Excellence in Education",
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
    contactPoint: { "@type": "ContactPoint", contactType: "admissions" },
  });

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
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <script type="application/ld+json">${jsonLd}</script>`;

  // Replace the existing title and add meta tags before </head>
  let result = html.replace(/<title>.*?<\/title>/, '');
  result = result.replace('</head>', `${metaTags}\n</head>`);
  
  return result;
}
