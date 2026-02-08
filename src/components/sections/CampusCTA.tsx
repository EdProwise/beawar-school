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
    <div className={`bg-card rounded-3xl border border-border ${isNested ? 'p-5 lg:p-6' : 'p-6 lg:p-8'} ${className}`}>
      <div className={`grid gap-8 items-center ${isNested ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <div>
          <h2 className={`font-heading font-bold text-foreground mb-4 ${isNested ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
            Want to See Our Campus?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Schedule a visit to experience our world-class facilities in person. 
            Our admissions team will be happy to give you a guided tour.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="sm" asChild>
              <Link to="/contact">
                Schedule a Visit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
        <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-medium bg-muted group ${isNested ? 'max-w-md' : ''}`}>
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
                alt="Beawar School campus overview" 
                loading="lazy"
                className="w-full h-full object-cover"
              />
          )}
        </div>
      </div>
    </div>
  );
}
