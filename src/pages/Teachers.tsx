import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { LogIn, CheckCircle, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

const Teachers = () => {
  const { data: portal, isLoading } = useQuery({
    queryKey: ["portal-content", "teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portal_content")
        .select("*")
        .eq("portal_type", "teachers")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const features = Array.isArray(portal?.features) ? portal.features : [
    "Mark Student Attendance",
    "Lesson Planning Tools",
    "Access Staff Notice Board",
    "Grade Assignments",
    "View Class Schedules",
    "Communicate with Parents"
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
          title="Teacher Portal"
          description="Access the teacher portal at Beawar School for resources and management tools."
          keywords="teacher portal, teacher login, Beawar School"
          jsonLd={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Teachers", path: "/teachers" }])}
        />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 mb-6">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              {portal?.page_title || "Teacher Portal"}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              {portal?.page_subtitle || "Manage your classroom and resources efficiently"}
            </p>
            {portal?.login_url ? (
              <Button variant="gold" size="lg" className="gap-2" asChild>
                <a href={portal.login_url} target="_blank" rel="noopener noreferrer">
                  <LogIn className="w-5 h-5" />
                  Login to Portal
                </a>
              </Button>
            ) : (
              <Button variant="gold" size="lg" className="gap-2">
                <LogIn className="w-5 h-5" />
                Login to Portal
              </Button>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                    Portal Features
                  </h2>
                  {portal?.intro_text && (
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {portal.intro_text}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-medium text-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary/30">
          <div className="container text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Technical Support
            </h2>
            <p className="text-muted-foreground mb-6">
              Need help with portal access? Contact the IT department.
            </p>
            <Button variant="outline" asChild>
              <a href="/contact">Get Support</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;
