import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram, Youtube, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitAdmissionInquiry, useSiteSettings } from "@/hooks/use-school-data";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    parent_name: "",
    phone: "",
    email: "",
    grade_applying: "",
    message: "",
  });
  
  const submitMutation = useSubmitAdmissionInquiry();

  const schoolName = settings?.school_name || "Orbit School";
  const address = settings?.address || "123 Education Lane, Academic District, City 12345";
  const phone = settings?.phone || "+1 234 567 8900";
  const phoneSecondary = settings?.phone_secondary;
  const email = settings?.email || "info@orbitschool.edu";
  const mapEmbedUrl = settings?.map_embed_url;
  const officeHoursWeekday = settings?.office_hours_weekday || "Mon - Fri: 8:00 AM - 5:00 PM";
  const officeHoursWeekend = settings?.office_hours_weekend || "Sat: 9:00 AM - 1:00 PM";

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: [address],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: phoneSecondary ? [phone, phoneSecondary] : [phone],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [email],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [officeHoursWeekday, officeHoursWeekend].filter(Boolean),
    },
  ];

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
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
            <div className="container relative text-center">
              <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
                Admission Inquiry
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Admission Inquiry
              </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Begin your child's journey to excellence. Fill out the form below and our admissions team will get in touch with you.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-10">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border shadow-medium text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

          {/* Contact Form & Map */}
          <section className="py-20 bg-background" id="enquiry">
            <div className="container">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Form */}
                <div className="bg-white rounded-[2rem] p-10 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">
                      Submit Admission Inquiry
                    </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1A1A1A]">Full Name *</label>
                        <input
                          type="text"
                          name="parent_name"
                          value={formData.parent_name}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#9CA3AF]"
                          placeholder="Parent's name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1A1A1A]">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#9CA3AF]"
                          placeholder="Your phone"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#1A1A1A]">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#9CA3AF]"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#1A1A1A]">Grade Applying For *</label>
                      <input
                        type="text"
                        name="grade_applying"
                        value={formData.grade_applying}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#9CA3AF]"
                        placeholder="e.g. Grade 5"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#1A1A1A]">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-[#9CA3AF]"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-7 text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          <span>Submit Admission Inquiry</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </div>

              {/* Map */}
              <div className="space-y-8">
                <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-medium h-80">
                  {mapEmbedUrl ? (
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="School Location"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <div className="text-center p-6">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Map location</p>
                        <p className="text-sm text-muted-foreground mt-2">{address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-medium">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Follow Us
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Stay connected with {schoolName} on social media for the latest news and updates.
                  </p>
                  <div className="flex gap-4">
                    {settings?.facebook_url && (
                      <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {settings?.twitter_url && (
                      <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {settings?.instagram_url && (
                      <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {settings?.youtube_url && (
                      <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                    {!settings?.facebook_url && !settings?.twitter_url && !settings?.instagram_url && !settings?.youtube_url && (
                      <>
                        <a href="#" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Youtube className="w-5 h-5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
