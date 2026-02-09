import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Linkedin, Instagram, Youtube, Loader2, ArrowRight, MessageSquare, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitAdmissionInquiry, useSiteSettings, useAdmissionSettings } from "@/hooks/use-school-data";
import { motion } from "framer-motion";

const Contact = () => {
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

  const schoolName = settings?.school_name || "PRJ GyanJaya";
  const address = settings?.address || "Rajasthan State Highway 59, Doongri Road, Beawar, Rajasthan 305901";
  const phone = settings?.phone || "+91 9214014888";
  const phoneSecondary = settings?.phone_secondary;
  const email = settings?.email || "prjgyanjaya@gmail.com";
  const mapEmbedUrl = settings?.map_embed_url;
  const officeHoursWeekday = settings?.office_hours_weekday || "Mon - Fri: 8:00 AM - 5:00 PM";
  const officeHoursWeekend = settings?.office_hours_weekend || "Sat: 9:00 AM - 1:00 PM";

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      details: [address],
      color: "from-blue-500 to-cyan-400",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Direct Contact",
      details: phoneSecondary ? [phone, phoneSecondary] : [phone],
      color: "from-purple-500 to-pink-400",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: [email],
      color: "from-amber-500 to-orange-400",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: [officeHoursWeekday, officeHoursWeekend].filter(Boolean),
      color: "from-emerald-500 to-teal-400",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600"
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
    <div className="min-h-screen bg-slate-50/50">
      <Header variant="light" />
      <main className="overflow-hidden">
        {/* Premium Hero Section with Animated Background */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-accent/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[10%] w-[20%] h-[30%] rounded-full bg-purple-500/5 blur-[80px]" />
          </div>

          <div className="container relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white/20 shadow-soft mb-6">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Get In Touch
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Let's Start a <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent">
                  Conversation
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Whether you have questions about admissions, academics, or campus life, 
                our team is here to guide you every step of the way.
              </p>
            </motion.div>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute left-0 bottom-0 w-full h-24 bg-gradient-to-t from-slate-50/50 to-transparent" />
        </section>

        {/* Floating Info Cards */}
        <section className="relative z-20 -mt-24 mb-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div className="h-full bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-soft hover:shadow-strong transition-all duration-300">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-slate-600 text-[15px] leading-relaxed font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form and Map Integration */}
        <section className="py-20 bg-white relative overflow-hidden" id="enquiry">
          {/* Decorative background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Form */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                {admissionSettings.use_custom_inquiry_html === 'true' && admissionSettings.inquiry_html ? (
                  <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-soft">
                    <div className="mb-10">
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {admissionSettings.inquiry_title || "Submit Admission Inquiry"}
                      </h2>
                      <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>
                    <div 
                      dangerouslySetInnerHTML={{ __html: admissionSettings.inquiry_html }} 
                      className="w-full flex justify-center premium-custom-form"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-soft relative overflow-hidden">
                    {/* Floating accents in form */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
                    
                    <div className="relative z-10">
                      <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                          Send us a Message
                        </h2>
                        <p className="text-slate-500 font-medium">
                          Fill out the form and our representative will reach out shortly.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name *</label>
                            <input
                              type="text"
                              name="parent_name"
                              value={formData.parent_name}
                              onChange={handleChange}
                              className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 placeholder:text-slate-400 font-medium"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 placeholder:text-slate-400 font-medium"
                              placeholder="+1 (555) 000-0000"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 placeholder:text-slate-400 font-medium"
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Grade Applying For *</label>
                            <input
                              type="text"
                              name="grade_applying"
                              value={formData.grade_applying}
                              onChange={handleChange}
                              className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 placeholder:text-slate-400 font-medium"
                              placeholder="e.g. Grade 5"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 resize-none placeholder:text-slate-400 font-medium"
                            placeholder="Tell us more about your inquiry..."
                          />
                        </div>
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full h-16 bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-white rounded-2xl text-lg font-bold shadow-strong shadow-primary/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]" 
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              <span>Submit Inquiry</span>
                              <Send className="w-5 h-5" />
                            </div>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Right Column: Map & Socials */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 space-y-8"
              >
                {/* Map Card */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-soft h-[400px]">
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
                        className="grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                        <div className="text-center p-12">
                          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-10 h-10 text-blue-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Location</h3>
                          <p className="text-slate-500 font-medium max-w-xs mx-auto">{address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Connect Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-strong">
                  {/* Floating accents */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16" />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                      Join Our Community
                      <Globe className="w-6 h-6 text-primary" />
                    </h3>
                    <p className="text-slate-400 font-medium mb-8 text-lg">
                      Follow our journey and stay updated with campus life, events, and academic achievements.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      {[
                        { icon: Facebook, url: settings?.facebook_url, label: 'Facebook' },
                        { icon: Linkedin, url: settings?.linkedin_url, label: 'Linkedin' },
                        { icon: Instagram, url: settings?.instagram_url, label: 'Instagram' },
                        { icon: Youtube, url: settings?.youtube_url, label: 'YouTube' }
                      ].map((social, i) => (
                        social.url ? (
                          <motion.a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all duration-300 border border-white/10"
                            aria-label={social.label}
                          >
                            <social.icon className="w-6 h-6" />
                          </motion.a>
                        ) : (
                          <motion.a
                            key={i}
                            href="#"
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all duration-300 border border-white/10"
                            aria-label={social.label}
                          >
                            <social.icon className="w-6 h-6" />
                          </motion.a>
                        )
                      ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Need Quick Help?</p>
                          <p className="text-xs text-slate-400">Chat with admissions</p>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
