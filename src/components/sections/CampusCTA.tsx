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

export function CampusCTA() {
  const { data: settings } = useSiteSettings();
  const campusVideoEmbedUrl = settings?.campus_video_url ? getYouTubeEmbedUrl(settings.campus_video_url) : null;

  return (
    <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border my-8">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
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
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-medium bg-muted group">
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
