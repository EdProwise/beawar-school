import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram, Youtube, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitContact, useSiteSettings } from "@/hooks/use-school-data";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const submitMutation = useSubmitContact();

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
        setFormData({ full_name: "", phone: "", email: "", subject: "", message: "" });
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
                Submit your enquiry
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Submit your enquiry
              </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Reach out for admissions inquiries, general questions, or to schedule a campus tour.
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
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-card rounded-2xl p-8 border border-border shadow-medium">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Submit your enquiry
                  </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="admissions">Admissions Inquiry</option>
                      <option value="academics">Academic Programs</option>
                      <option value="facilities">Campus & Facilities</option>
                      <option value="fees">Fee Structure</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                          <Send className="w-5 h-5" />
                          Submit your enquiry
                        </>
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
