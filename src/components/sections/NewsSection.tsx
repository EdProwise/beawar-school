import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents, useUpcomingEvents } from "@/hooks/use-school-data";

export function NewsSection() {
  const { data: newsItems = [], isLoading } = useNewsEvents(3);
  const { data: upcomingEvents = [] } = useUpcomingEvents();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString(),
    };
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* News Cards */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse flex">
                  <div className="w-1/3 h-32 bg-secondary rounded-lg" />
                  <div className="flex-1 pl-4 space-y-2">
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
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-strong transition-all duration-300 flex flex-col sm:flex-row"
                >
                  {/* Image */}
                  <div className="relative sm:w-1/3 h-48 sm:h-auto overflow-hidden">
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
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      {item.excerpt}
                    </p>
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news articles available.</p>
              </div>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-6 pb-4 border-b border-border">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 3).map((event) => {
                    const { month, day } = formatEventDate(event.event_date || event.created_at);
                    return (
                      <div
                        key={event.id}
                        className="flex gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center">
                            <span className="text-xs font-medium">{month}</span>
                            <span className="text-lg font-bold">{day}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {event.title}
                          </h4>
                          {event.event_time && (
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <Clock className="w-3 h-3" />
                              {event.event_time}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No upcoming events scheduled.
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/news">View All Events</Link>
              </Button>
            </div>
          </div>
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
