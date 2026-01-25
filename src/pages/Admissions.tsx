import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight, HelpCircle, Loader2, FileText, Building, ClipboardList, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitAdmissionInquiry, useAdmissionSteps, useAdmissionFaqs } from "@/hooks/use-school-data";
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

const Admissions = () => {
  const [formData, setFormData] = useState({
    parent_name: "",
    email: "",
    phone: "",
    grade_applying: "",
  });
  
  const submitMutation = useSubmitAdmissionInquiry();
  const { data: steps = [], isLoading: stepsLoading } = useAdmissionSteps();
  const { data: faqs = [], isLoading: faqsLoading } = useAdmissionFaqs();

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
              Join the Orbit Family
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Begin your child's journey to excellence. Applications are now open.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="gold" size="lg" asChild>
                <a href="#inquiry">Apply Now</a>
              </Button>
              <Button variant="hero" size="lg">Download Brochure</Button>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((step: any) => {
                  const IconComponent = iconMap[step.icon_name] || CheckCircle;
                  return (
                    <div
                      key={step.id}
                      className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                          {step.step_number}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {step.description}
                          </p>
                        </div>
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
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                    Get Started
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Submit Your Inquiry
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Take the first step towards giving your child an exceptional education. 
                    Fill out the form and our admissions team will get in touch within 24 hours.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <span className="text-foreground">Quick response within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <span className="text-foreground">Personalized campus tour</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <span className="text-foreground">Meet our faculty and staff</span>
                    </div>
                  </div>
                </div>

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
                      <select
                        name="grade_applying"
                        value={formData.grade_applying}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="">Select Grade</option>
                        <option value="Pre-Primary">Pre-Primary (Nursery - KG)</option>
                        <option value="Grade 1-5">Primary (Grade 1-5)</option>
                        <option value="Grade 6-8">Middle School (Grade 6-8)</option>
                        <option value="Grade 9-10">Secondary (Grade 9-10)</option>
                        <option value="Grade 11-12">Higher Secondary (Grade 11-12)</option>
                      </select>
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

export default Admissions;
