import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-school-data";

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

interface CampusCTAProps {
  className?: string;
  isNested?: boolean;
}

export function CampusCTA({ className, isNested }: CampusCTAProps) {
  const { data: settings } = useSiteSettings();
  const campusVideoEmbedUrl = settings?.campus_video_url ? getYouTubeEmbedUrl(settings.campus_video_url) : null;

    return (
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 ${isNested ? 'p-6 lg:p-8' : 'p-8 lg:p-12'} ${className}`}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

        <div className={`relative z-10 grid gap-8 items-center ${isNested ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white/90 text-sm font-semibold">Visit Us Today</span>
            </div>
            <h2 className={`font-heading font-bold text-white mb-4 ${isNested ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'}`}>
              Want to See Our Campus?
            </h2>
            <p className="text-white/70 mb-8 text-base leading-relaxed max-w-lg">
              Schedule a visit to experience our world-class facilities in person. 
              Our admissions team will be happy to give you a guided tour.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-white text-violet-700 hover:bg-white/90 shadow-xl shadow-black/10 rounded-xl font-bold">
                <Link to="/contact">
                  Schedule a Visit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white/10 rounded-xl font-bold">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
          <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10 bg-black/20 ${isNested ? 'max-w-md' : ''}`}>
            {campusVideoEmbedUrl ? (
              <iframe
                src={campusVideoEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : settings?.campus_video_url ? (
              <video 
                src={settings.campus_video_url} 
                controls 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="/hero_campus.png" 
                alt="Campus" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
  );
}
