import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { useToast } from "@/hooks/use-toast";

// Types
export interface NewsEvent {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: "announcement" | "achievement" | "event" | "notice";
  image_url: string | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_image: string | null;
  rating: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface ContactSubmission {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface AdmissionInquiry {
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  message?: string;
}

export interface NewsletterSubscription {
  email: string;
}

// Scroll Words
export interface ScrollWord {
  id: string;
  text: string;
  is_active: boolean;
  sort_order: number;
}

export function useScrollWords() {
  return useQuery({
    queryKey: ["scroll-words"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scroll_words")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ScrollWord[];
    },
  });
}

// News & Events Hooks
export function useNewsEvents(limit?: number) {
  return useQuery({
    queryKey: ["news-events", limit],
    queryFn: async () => {
      let query = supabase
        .from("news_events")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as NewsEvent[];
    },
  });
}

export function useNewsBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["news-event", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data as NewsEvent | null;
    },
    enabled: !!slug,
  });
}

export function useFeaturedNews() {
  return useQuery({
    queryKey: ["featured-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as NewsEvent | null;
    },
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .eq("is_published", true)
        .eq("category", "event")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as NewsEvent[];
    },
  });
}

// Gallery Hooks
export function useGalleryItems(category?: string) {
  return useQuery({
    queryKey: ["gallery-items", category],
    queryFn: async () => {
      let query = supabase
        .from("gallery_items")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
}

// Testimonials Hooks
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

// Contact Form Hook
export function useSubmitContact() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ContactSubmission) => {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Admission Inquiry Hook
export function useSubmitAdmissionInquiry() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AdmissionInquiry) => {
      const { error } = await supabase
        .from("admission_inquiries")
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. Our admissions team will contact you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Admission Steps
export function useAdmissionSteps() {
  return useQuery({
    queryKey: ["admission-steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_steps")
        .select("*")
        .eq("is_active", true)
        .order("step_number");
      if (error) throw error;
      return data;
    },
  });
}

// Admission FAQs
export function useAdmissionFaqs() {
  return useQuery({
    queryKey: ["admission-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

// Admission Settings
export function useAdmissionSettings() {
  return useQuery({
    queryKey: ["admission-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_settings")
        .select("*");
      if (error) throw error;
      
      // Convert array to key-value object
      return data.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    },
  });
}

// Newsletter Subscription Hook
export function useSubscribeNewsletter() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: NewsletterSubscription) => {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([data]);

      if (error) {
        if (error.code === "23505") {
          throw new Error("Already subscribed");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "You've been successfully subscribed to our newsletter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: error.message === "Already subscribed" ? "Already Subscribed" : "Error",
        description: error.message === "Already subscribed" 
          ? "This email is already subscribed to our newsletter." 
          : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// ============ CMS HOOKS ============

// Site Settings
export interface SiteSettings {
  id: string;
  school_name: string;
  tagline: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  phone_secondary: string | null;
  address: string | null;
  map_embed_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  whatsapp_number: string | null;
  footer_text: string | null;
  primary_color: string | null;
  accent_color: string | null;
  campus_video_url: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  office_hours_weekday: string | null;
  office_hours_weekend: string | null;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// Hero Slides
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });
}

// About Content
export interface AboutContent {
  id: string;
  section_title: string | null;
  main_heading: string | null;
  main_description: string | null;
  mission_title: string | null;
  mission_text: string | null;
  vision_title: string | null;
  vision_text: string | null;
  history_text: string | null;
  main_image_url: string | null;
  years_of_excellence: number | null;
}

export function useAboutContent() {
  return useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as AboutContent | null;
    },
  });
}

// Highlight Cards
export interface HighlightCard {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useHighlightCards() {
  return useQuery({
    queryKey: ["highlight-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("highlight_cards")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as HighlightCard[];
    },
  });
}

// Statistics
export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Statistic[];
    },
  });
}

// Academic Programs
export interface AcademicProgram {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  grade_range: string | null;
  features: string[] | null;
  is_active: boolean;
  sort_order: number;
}

export function useAcademicPrograms() {
  return useQuery({
    queryKey: ["academic-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_programs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as AcademicProgram[];
    },
  });
}

// Facilities
export interface Facility {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  images: string[] | null;
  is_active: boolean;
  sort_order: number;
}

export function useFacilities() {
  return useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Facility[];
    },
  });
}

// Core Values
export interface CoreValue {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useCoreValues() {
  return useQuery({
    queryKey: ["core-values"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("core_values")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CoreValue[];
    },
  });
}

// Milestones
export interface Milestone {
  id: string;
  year: string;
  event: string;
  is_active: boolean;
  sort_order: number;
}

export function useMilestones() {
  return useQuery({
    queryKey: ["milestones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Milestone[];
    },
  });
}

// Academic Excellence
export interface AcademicExcellence {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useAcademicExcellence() {
  return useQuery({
    queryKey: ["academic-excellence"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_excellence")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as AcademicExcellence[];
    },
  });
}

// Extracurricular Categories
export interface ExtracurricularCategory {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  activities: string[] | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useExtracurricularCategories() {
  return useQuery({
    queryKey: ["extracurricular-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extracurricular_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ExtracurricularCategory[];
    },
  });
}

// Extracurricular Highlights
export interface ExtracurricularHighlight {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useExtracurricularHighlights() {
  return useQuery({
    queryKey: ["extracurricular-highlights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extracurricular_highlights")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ExtracurricularHighlight[];
    },
  });
}
