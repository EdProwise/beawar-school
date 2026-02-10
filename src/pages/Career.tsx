import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/mongodb/client";
import { useSiteSettings } from "@/hooks/use-school-data";
import { Loader2, Upload, Briefcase, CheckCircle } from "lucide-react";

export default function Career() {
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "Our School";

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    qualification: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone || !formData.position) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let cv_url = "";

      if (cvFile) {
        const ext = cvFile.name.split(".").pop();
        const fileName = `cv_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("career-cvs")
          .upload(fileName, cvFile);

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage
          .from("career-cvs")
          .getPublicUrl(uploadData.path);
        cv_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("career_applications").insert([
        { ...formData, cv_url },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "Application submitted successfully!" });
    } catch (err: any) {
      toast({ title: "Error submitting application", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
            </div>
            <div className="container relative text-center">
              <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
                Careers
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Application Submitted
              </h1>
            </div>
          </section>
          <section className="py-20 bg-background">
            <div className="container max-w-lg text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="font-heading text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-8">
                Your application has been submitted successfully. We will review your details and get back to you soon.
              </p>
              <Button onClick={() => { setSubmitted(false); setFormData({ full_name: "", email: "", phone: "", position: "", experience: "", qualification: "", message: "" }); setCvFile(null); }}>
                Submit Another Application
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
              Careers
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Join Our Team
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Be a part of {schoolName}'s mission to shape the future. We're looking for passionate educators and professionals.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-2xl">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Apply Now</h2>
                  <p className="text-muted-foreground text-sm">Fill in your details and upload your CV</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position Applied For *</Label>
                    <Input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="e.g., Math Teacher" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g., 5 years" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g., B.Ed, M.A." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Cover Letter / Message</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about yourself and why you'd like to join..." rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">Upload CV (PDF, DOC, DOCX) *</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="cv" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      {cvFile ? (
                        <p className="text-sm font-medium text-primary">{cvFile.name}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Click to upload your CV</p>
                      )}
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
