import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitAdmissionInquiry, useSiteSettings, useAdmissionSettings } from "@/hooks/use-school-data";

export function ContactCTASection() {
  const { data: settings } = useSiteSettings();
  const { data: admissionSettings = {} } = useAdmissionSettings();
  const [formData, setFormData] = useState({
    parent_name: "",
    phone: "",
    email: "",
    grade_applying: "",
    message: "",
  });
  
  const submitMutation = useSubmitAdmissionInquiry();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ parent_name: "", phone: "", email: "", grade_applying: "", message: "" });
      },
    });
  };

  return (
    <section className="py-12 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero_campus.png"
          alt="Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/90 to-primary/80" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              Get In Touch
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Join the{" "}
              <span className="text-gradient-gold">Orbit Family?</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Take the first step towards a brighter future. Contact us today 
              to learn more about admissions, schedule a campus tour, or speak 
              with our counselors.
            </p>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent-foreground" />
                </div>
                  <div>
                    <p className="text-primary-foreground/60 text-xs">Call Us</p>
                    <p className="text-primary-foreground font-medium">{settings?.phone || ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/60 text-xs">Email Us</p>
                    <p className="text-primary-foreground font-medium">{settings?.email || ""}</p>
                  </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero-gold" size="lg" asChild>
                <Link to="/admissions/process">
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Quick Inquiry Form */}
          <div className="bg-card rounded-2xl p-8 shadow-strong">
            {admissionSettings.use_custom_inquiry_html === 'true' && admissionSettings.inquiry_html ? (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  {admissionSettings.inquiry_title || "Quick Inquiry"}
                </h3>
                <div 
                  dangerouslySetInnerHTML={{ __html: admissionSettings.inquiry_html }} 
                  className="w-full flex justify-center"
                />
              </>
            ) : (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  Quick Inquiry
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Parent Name *
                      </label>
                      <input
                        type="text"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Your phone"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Grade Applying For *
                    </label>
                    <input
                      type="text"
                      name="grade_applying"
                      value={formData.grade_applying}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="e.g. Grade 5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="lg" 
                    className="w-full"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
