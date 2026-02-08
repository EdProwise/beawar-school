import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight, HelpCircle, Loader2, FileText, Building, ClipboardList, GraduationCap, Users, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitAdmissionInquiry, useAdmissionSteps, useAdmissionFaqs, useAdmissionSettings } from "@/hooks/use-school-data";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const iconMap: { [key: string]: any } = {
  FileText,
  Building,
  ClipboardList,
  GraduationCap,
  Users,
  CheckCircle,
};

const stepColors = [
  {
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-100",
    hover: "group-hover:border-indigo-300",
    accent: "bg-indigo-600",
    shadow: "hover:shadow-indigo-100",
  },
  {
    bg: "bg-rose-50",
    iconBg: "bg-rose-600",
    text: "text-rose-600",
    border: "border-rose-100",
    hover: "group-hover:border-rose-300",
    accent: "bg-rose-600",
    shadow: "hover:shadow-rose-100",
  },
  {
    bg: "bg-amber-50",
    iconBg: "bg-amber-600",
    text: "text-amber-600",
    border: "border-amber-100",
    hover: "group-hover:border-amber-300",
    accent: "bg-amber-600",
    shadow: "hover:shadow-amber-100",
  },
  {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-100",
    hover: "group-hover:border-emerald-300",
    accent: "bg-emerald-600",
    shadow: "hover:shadow-emerald-100",
  },
  {
    bg: "bg-purple-50",
    iconBg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-100",
    hover: "group-hover:border-purple-300",
    accent: "bg-purple-600",
    shadow: "hover:shadow-purple-100",
  },
  {
    bg: "bg-sky-50",
    iconBg: "bg-sky-600",
    text: "text-sky-600",
    border: "border-sky-100",
    hover: "group-hover:border-sky-300",
    accent: "bg-sky-600",
    shadow: "hover:shadow-sky-100",
  },
];

const AdmissionProcess = () => {
  const [formData, setFormData] = useState({
    parent_name: "",
    email: "",
    phone: "",
    grade_applying: "",
  });
  
  const submitMutation = useSubmitAdmissionInquiry();
  const { data: steps = [], isLoading: stepsLoading } = useAdmissionSteps();
  const { data: faqs = [], isLoading: faqsLoading } = useAdmissionFaqs();
  const { data: settings = {} } = useAdmissionSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ parent_name: "", email: "", phone: "", grade_applying: "" });
      },
    });
  };

  return (
    <div className="min-h-screen">
      <SEOHead
          title="Admission Process"
          description="Everything you need to know about the admission process, requirements, and enrollment at Beawar School."
          keywords="admission process, enrollment, apply, Beawar School admissions"
          jsonLd={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Admissions", path: "/admissions/process" }])}
        />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              Admissions
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Admission Process
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Begin your child's journey to excellence. Applications are now open.
            </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="gold" size="lg" asChild>
                  <a href="#inquiry">Apply Now</a>
                </Button>
                <Button variant="hero" size="lg" asChild disabled={!settings.brochure_url}>
                  <a 
                    href={settings.brochure_url || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <FileDown className="w-5 h-5" />
                    Download Brochure
                  </a>
                </Button>
              </div>

          </div>
        </section>

        {/* Admission Process */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Admission Process
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                How to Apply
              </h2>
            </div>

            {stepsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {steps.map((step: any, index: number) => {
                    const IconComponent = iconMap[step.icon_name] || CheckCircle;
                    const color = stepColors[index % stepColors.length];
                    return (
                      <div
                        key={step.id}
                        className={`group relative bg-card rounded-[2rem] p-8 border ${color.border} ${color.hover} transition-all duration-500 hover:-translate-y-2 shadow-sm ${color.shadow} overflow-hidden`}
                      >
                        {/* Decorative Background Element */}
                        <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 ${color.accent} blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${color.iconBg} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                              <IconComponent className="w-7 h-7" />
                            </div>
                            <span className={`text-4xl font-bold opacity-10 ${color.text} font-heading group-hover:opacity-20 transition-opacity`}>
                              {String(step.step_number).padStart(2, '0')}
                            </span>
                          </div>
                          
                          <h3 className={`font-heading text-xl font-bold text-foreground mb-3 transition-colors`}>
                            {step.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>

                          {/* Animated accent line */}
                          <div className={`absolute bottom-0 left-0 h-1 w-0 ${color.accent} transition-all duration-500 group-hover:w-full`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
            )}
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-20 bg-secondary/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-[40%_60%] gap-12 items-center">
                    <div>
                      <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        {settings.inquiry_badge || "Get Started"}
                      </span>
                      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                        {settings.inquiry_title || "Submit Your Inquiry"}
                      </h2>
                      <p className="text-muted-foreground mb-8">
                        {settings.inquiry_description || "Take the first step towards giving your child an exceptional education. Fill out the form and our admissions team will get in touch within 24 hours."}
                      </p>
                      <div className="space-y-4">

                      {(settings.inquiry_feature_1 || (!settings.inquiry_feature_1 && !settings.inquiry_feature_2 && !settings.inquiry_feature_3)) && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <span className="text-foreground">{settings.inquiry_feature_1 || "Quick response within 24 hours"}</span>
                        </div>
                      )}
                      
                      {settings.inquiry_feature_2 && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <span className="text-foreground">{settings.inquiry_feature_2}</span>
                        </div>
                      )}

                      {settings.inquiry_feature_3 && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <span className="text-foreground">{settings.inquiry_feature_3}</span>
                        </div>
                      )}
                    </div>
                    </div>

                  {settings.use_custom_inquiry_html === 'true' && settings.inquiry_html ? (
                    <div className="bg-card rounded-2xl p-4 shadow-elegant border border-border overflow-hidden">
                      <div 
                        dangerouslySetInnerHTML={{ __html: settings.inquiry_html }} 
                        className="w-full flex justify-center"
                      />
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Parent's Name *
                          </label>
                          <input
                            type="text"
                            name="parent_name"
                            value={formData.parent_name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Enter your name"
                          />
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
                            required
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="your@email.com"
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
                            required
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="+91 98765 43210"
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
                              required
                              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              placeholder="e.g. Grade 5"
                            />
                          </div>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg"
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Inquiry
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  )}
                </div>

            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                <HelpCircle className="w-4 h-4 inline mr-1" />
                FAQs
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : faqs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq: any, index: number) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="bg-card rounded-xl border border-border px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center text-muted-foreground">No FAQs available.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdmissionProcess;
