import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { X, ExternalLink, Send, Loader2, CheckCircle2, Phone, Mail, User, GraduationCap, MessageSquare, Play, Info, Image as ImageIcon } from "lucide-react";
import { useSubmitAdmissionInquiry, useAdmissionSettings } from "@/hooks/use-school-data";

const SESSION_KEY_PREFIX = "popup_shown_";

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function toEmbedUrl(url: string) {
  if (url.includes("/embed/")) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
}

function VideoPlayer({ url, title }: { url: string; title?: string }) {
  if (isYouTubeUrl(url)) {
    return (
      <div className="relative w-full shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={toEmbedUrl(url)}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title || "Popup video"}
        />
      </div>
    );
  }
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <video
        src={url}
        controls
        autoPlay
        muted
        className="w-full max-h-[50vh]"
      />
    </div>
  );
}

function LinkButton({ url, label, onClick }: { url: string; label?: string; onClick: () => void }) {
  return (
    <a
      href={url}
      target={url.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="relative group overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
      onClick={onClick}
    >
      <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
      {label || "Learn More"}
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}

/* ── Beautiful split-panel contact form ─────────────────────────────── */
function ContactFormInPopup({
  heading,
  subheading,
  imageUrl,
  onClose,
}: {
  heading: string;
  subheading: string;
  imageUrl?: string;
  onClose: () => void;
}) {
  const submitMutation = useSubmitAdmissionInquiry();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parent_name: "",
    phone: "",
    email: "",
    grade_applying: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData, {
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(onClose, 2800);
      },
    });
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-0">
        {/* ── Left panel (square image / gradient) ── */}
        <div
          className="relative sm:w-[396px] lg:w-[436px] flex-shrink-0 h-48 sm:h-auto overflow-hidden group"
          style={
            imageUrl
              ? {
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {/* Gradient fallback (always layered on top for tinting) */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              background: imageUrl
                ? "linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)"
                : "linear-gradient(160deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
            }}
          />

          {/* Decorative circles - enhanced with blur */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
            {/* Top badge - Enhanced */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider self-start shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Admissions Open
            </div>

            {/* Center text */}
            <div className="space-y-3">
              <h1 className="text-4xl font-black leading-tight drop-shadow-xl tracking-tight">
                {heading || "Get in Touch"}
              </h1>
              {subheading && (
                <p className="text-base text-white/90 leading-relaxed font-medium drop-shadow-md max-w-[280px]">
                  {subheading}
                </p>
              )}
            </div>

            {/* Bottom icons strip */}
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>Call</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <span>Enroll</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] sm:max-h-[600px] bg-background/50 backdrop-blur-sm">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-5 h-full min-h-[350px] text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in duration-500" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-foreground tracking-tight">Thank You!</p>
                <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                  We've received your enquiry and will get back to you shortly.
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-sm"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h2 className="text-xl font-black text-foreground tracking-tight">Enquire Now</h2>
                <div className="h-1 w-12 bg-primary rounded-full mt-2" />
                <p className="text-sm text-muted-foreground mt-3 font-medium">
                  We'd love to hear from you. Fill in the details below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                  <input
                    type="text"
                    name="parent_name"
                    required
                    value={formData.parent_name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone *"
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Grade */}
                <div className="relative group">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                  <select
                    name="grade_applying"
                    value={formData.grade_applying}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Select Grade / Class</option>
                    {["Nursery", "KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                      "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="relative group">
                  <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                  <textarea
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message (optional)"
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full relative group overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
                  {submitMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitMutation.isPending ? "Submitting..." : "Send Enquiry Now"}
                </button>

                <p className="text-center text-[11px] text-muted-foreground font-medium uppercase tracking-wider opacity-60">
                  We respect your privacy • Secure Submission
                </p>
              </form>
            </>
          )}
        </div>
    </div>
  );
}

/* ── External form (split-panel with same image left side) ───────────── */
function ExternalFormInPopup({
  heading,
  subheading,
  imageUrl,
  inquiryHtml,
}: {
  heading: string;
  subheading: string;
  imageUrl?: string;
  inquiryHtml: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row min-h-0">
      {/* Left panel */}
      <div
        className="relative sm:w-[396px] lg:w-[436px] flex-shrink-0 h-48 sm:h-auto overflow-hidden group"
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            background: imageUrl
              ? "linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)"
              : "linear-gradient(160deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
          }}
        />
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider self-start shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Admissions Open
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black leading-tight drop-shadow-xl tracking-tight">
              {heading || "Get in Touch"}
            </h1>
            {subheading && (
              <p className="text-base text-white/90 leading-relaxed font-medium drop-shadow-md max-w-[280px]">
                {subheading}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>Call</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: external embed */}
      <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] sm:max-h-[600px] bg-background/50 backdrop-blur-sm">
        <div className="mb-6">
          <h1 className="text-xl font-black text-foreground tracking-tight">Get Personalised Admission Guidance</h1>
          <div className="h-1 w-12 bg-primary rounded-full mt-2" />
          <p className="text-sm text-muted-foreground mt-4 font-medium leading-relaxed">Share your details below and our admissions experts will get in touch with you to guide you personally.</p>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: inquiryHtml }}
          className="w-full"
        />
      </div>
    </div>
  );
}

/* ── Main popup orchestrator ─────────────────────────────────────────── */
export function HomepagePopup() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visible, setVisible] = useState(false);

  const { data: popups } = useQuery({
    queryKey: ["popup-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_config")
        .select("*")
        .eq("enabled", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: admissionSettings = {} } = useAdmissionSettings();

  const showNextPopup = useCallback((index: number) => {
    if (!popups || index >= popups.length) return;
    
    const popup = popups[index];
    const sessionKey = `${SESSION_KEY_PREFIX}${popup.id}`;
    const alreadyShown = sessionStorage.getItem(sessionKey);

    if (popup.show_once && alreadyShown) {
      // Skip this one and try next immediately
      showNextPopup(index + 1);
      return;
    }

    // Set a timer for this specific popup's initial delay
    const delay = (index === 0 ? (popup.delay_seconds ?? 2) : 0) * 1000;
    
    const timer = setTimeout(() => {
      setCurrentIndex(index);
      setVisible(true);
      if (popup.show_once) sessionStorage.setItem(sessionKey, "1");
    }, delay);

    return timer;
  }, [popups]);

  useEffect(() => {
    if (popups && popups.length > 0 && currentIndex === -1) {
      showNextPopup(0);
    }
  }, [popups, currentIndex, showNextPopup]);

  const close = () => {
    const currentPopup = popups?.[currentIndex];
    const gap = (currentPopup?.gap_seconds ?? 5) * 1000;
    
    setVisible(false);
    
    // Schedule next popup after gap
    if (popups && currentIndex < popups.length - 1) {
      setTimeout(() => {
        showNextPopup(currentIndex + 1);
      }, gap);
    }
  };

  const data = popups?.[currentIndex];
  if (!visible || !data) return null;

  const hasLink = !!data.link_url;
  const isContactForm = data.content_type === "contact_form";
  const useExternalForm = isContactForm && !!data.form_use_external;
  const externalHtml: string = (admissionSettings as any)?.inquiry_html ?? "";
  const hasExternalHtml = useExternalForm && !!externalHtml;
  const formImageUrl: string = data.form_image_url || "";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={close}
    >
      <div
        className={`relative bg-card rounded-3xl shadow-2xl w-full overflow-hidden border border-white/10
              ${isContactForm ? "max-w-4xl animate-in fade-in zoom-in-95 duration-500 ease-out" : "max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-500"}
          max-h-[92vh] flex flex-col`}
        style={{ boxShadow: "0 25px 80px -20px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-1 min-h-0 relative">
          {/* Decorative background elements for text-based popups */}
          {!isContactForm && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
               <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            </div>
          )}

          {/* ── CONTACT FORM ─────────────────────────────────────────── */}
          {isContactForm && (
            hasExternalHtml ? (
              <ExternalFormInPopup
                heading={data.form_heading || "Get in Touch"}
                subheading={data.form_subheading || ""}
                imageUrl={formImageUrl || undefined}
                inquiryHtml={externalHtml}
              />
            ) : (
              <ContactFormInPopup
                heading={data.form_heading || "Get in Touch"}
                subheading={data.form_subheading || ""}
                imageUrl={formImageUrl || undefined}
                onClose={close}
              />
            )
          )}

          {/* ── IMAGE ────────────────────────────────────────────────── */}
          {data.content_type === "image" && (
            <div className="flex flex-col h-full">
              {data.title && (
                <div className="px-8 pt-8 pb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Annoucement</span>
                  </div>
                  <h2 className="text-2xl font-black text-foreground pr-8 tracking-tight">{data.title}</h2>
                  <div className="h-1 w-12 bg-primary rounded-full mt-3" />
                </div>
              )}
              <div className={`space-y-6 ${data.title ? "px-8 pb-8 pt-2" : "p-8"}`}>
                {data.image_url && (
                  <div className="relative group overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
                    {hasLink ? (
                      <a
                        href={data.link_url}
                        target={data.link_url.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        onClick={close}
                        className="block"
                      >
                        <img
                          src={data.image_url}
                          alt={data.title || "Popup"}
                          className="w-full object-contain max-h-[60vh] cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                      </a>
                    ) : (
                      <img
                        src={data.image_url}
                        alt={data.title || "Popup"}
                        className="w-full object-contain max-h-[60vh]"
                      />
                    )}
                  </div>
                )}
                {hasLink && (
                  <div className="flex justify-center pt-2">
                    <LinkButton url={data.link_url} label={data.link_label} onClick={close} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── VIDEO ────────────────────────────────────────────────── */}
          {data.content_type === "video" && (
            <div className="flex flex-col h-full">
              {data.title && (
                <div className="px-8 pt-8 pb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Play className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Featured Video</span>
                  </div>
                  <h2 className="text-2xl font-black text-foreground pr-8 tracking-tight">{data.title}</h2>
                  <div className="h-1 w-12 bg-primary rounded-full mt-3" />
                </div>
              )}
              <div className={`space-y-6 ${data.title ? "px-8 pb-8 pt-2" : "p-8"}`}>
                {data.video_url && <VideoPlayer url={data.video_url} title={data.title} />}
                {hasLink && (
                  <div className="flex justify-center pt-2">
                    <LinkButton url={data.link_url} label={data.link_label} onClick={close} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TEXT ─────────────────────────────────────────────────── */}
          {data.content_type === "text" && (
            <div className="flex flex-col h-full">
              {data.title && (
                <div className="px-8 pt-8 pb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Information</span>
                  </div>
                  <h2 className="text-2xl font-black text-foreground pr-8 tracking-tight">{data.title}</h2>
                  <div className="h-1 w-12 bg-primary rounded-full mt-3" />
                </div>
              )}
              <div className={`space-y-6 ${data.title ? "px-8 pb-8 pt-2" : "p-8"}`}>
                {data.body_text && (
                  <div className="relative">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed font-medium text-lg tracking-tight">
                      {data.body_text}
                    </p>
                  </div>
                )}
                {hasLink && (
                  <div className="flex justify-center pt-2">
                    <LinkButton url={data.link_url} label={data.link_label} onClick={close} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LINK / URL ───────────────────────────────────────────── */}
          {data.content_type === "link" && (
            <div className="flex flex-col h-full">
              {data.title && (
                <div className="px-8 pt-8 pb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Update</span>
                  </div>
                  <h2 className="text-2xl font-black text-foreground pr-8 tracking-tight">{data.title}</h2>
                  <div className="h-1 w-12 bg-primary rounded-full mt-3" />
                </div>
              )}
              <div className={`space-y-6 ${data.title ? "px-8 pb-8 pt-2" : "p-8"}`}>
                {data.image_url && (
                  <div className="relative group overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
                    <img
                      src={data.image_url}
                      alt={data.title || "Popup"}
                      className="w-full object-contain max-h-[40vh] group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                {data.video_url && <VideoPlayer url={data.video_url} title={data.title} />}
                {data.body_text && (
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed font-medium">
                    {data.body_text}
                  </p>
                )}
                {hasLink && (
                  <div className="flex justify-center pt-2">
                    <LinkButton url={data.link_url} label={data.link_label} onClick={close} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
