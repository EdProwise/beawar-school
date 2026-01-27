import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents } from "@/hooks/use-school-data";

export function NewsSection() {
  const { data: newsItems = [], isLoading } = useNewsEvents(4);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stripHtml = (html: string | null | undefined) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
            News & Events
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Latest <span className="text-gradient-gold">Updates</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay informed about the latest happenings at Orbit School
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 animate-pulse border border-border">
                <div className="aspect-video bg-secondary rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-secondary rounded w-1/4" />
                  <div className="h-6 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))
          ) : newsItems.length > 0 ? (
            newsItems.map((item) => (
              <article
                key={item.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-strong transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image_url || "/classroom.png"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.created_at)}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                    {stripHtml(item.excerpt)}
                  </p>
                  <Link
                    to={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors mt-auto"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No news articles available.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" asChild>
            <Link to="/news">
              View All News & Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
