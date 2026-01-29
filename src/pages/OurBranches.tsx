import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-school-data";

const branches = [
  {
    name: "Main Campus",
    address: "123 School Lane, City Center, State 12345",
    phone: "+91 12345 67890",
    email: "main@orbitschool.com",
    hours: "Mon - Sat: 8:00 AM - 4:00 PM",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.336499878144!2d73.8446214!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07a9b1c9c81%3A0x8f2d5c3b6f0e4b8a!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },
  {
    name: "West Branch",
    address: "456 West Side Avenue, Suburban Area, State 12346",
    phone: "+91 12345 67891",
    email: "west@orbitschool.com",
    hours: "Mon - Sat: 8:00 AM - 4:00 PM",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.336499878144!2d73.8446214!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07a9b1c9c81%3A0x8f2d5c3b6f0e4b8a!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  }
];

export function OurBranches() {
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "Orbit School";

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
              Our Presence
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Branches
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Find the {schoolName} campus nearest to you and join our community of learners.
            </p>
          </div>
        </section>

        {/* Branches List */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {branches.map((branch, index) => (
                <div key={index} className="bg-card border border-border rounded-3xl overflow-hidden shadow-strong group hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <iframe
                      src={branch.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={branch.name}
                      className="grayscale group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                  </div>
                  <div className="p-8">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{branch.name}</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-muted-foreground pt-2">{branch.address}</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-accent-dark" />
                        </div>
                        <p className="text-muted-foreground pt-2">{branch.phone}</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-indigo-600" />
                        </div>
                        <p className="text-muted-foreground pt-2">{branch.email}</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-muted-foreground pt-2">{branch.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OurBranches;
