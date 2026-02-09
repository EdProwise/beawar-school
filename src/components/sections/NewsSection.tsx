import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents, useUpcomingEvents } from "@/hooks/use-school-data";

export function NewsSection() {
  const { data: fetchedNews = [], isLoading: isLoadingNews } = useNewsEvents(6);
  const { data: upcomingEvents = [], isLoading: isLoadingEvents } = useUpcomingEvents();

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatEventDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return { day: "00", month: "MMM" };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { day: "00", month: "MMM" };
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const stripHtml = (html: string | null | undefined) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const newsItems = fetchedNews;

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
            News & Updates
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Latest <span className="text-gradient-gold">Updates</span> & Events
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay informed about the latest happenings and upcoming events at PRJ GyanJaya
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Latest News - 75% area */}
          <div className="lg:w-[75%]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingNews ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 animate-pulse border border-border h-full">
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
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-strong transition-all duration-300 flex flex-col h-full"
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
                        to={item.slug ? `/news/${item.slug}` : "/news"}
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
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/news">
                  View All News
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Upcoming Events - 25% area */}
          <div className="lg:w-[25%]">
            <div className="bg-card rounded-2xl border border-border p-6 h-full shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Upcoming Events
                </h3>
                <Link to="/news?category=event" className="text-primary hover:text-primary-dark transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="space-y-6">
                {isLoadingEvents ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-14 h-14 bg-secondary rounded-lg shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-secondary rounded w-full" />
                        <div className="h-3 bg-secondary rounded w-2/3" />
                      </div>
                    </div>
                  ))
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const { day, month } = formatEventDate(event.event_date);
                    return (
                      <div key={event.id} className="group flex gap-4">
                        {/* Date Box */}
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                          <span className="text-xl font-bold text-primary group-hover:text-primary-foreground leading-none">
                            {day}
                          </span>
                          <span className="text-[10px] font-bold text-primary/70 group-hover:text-primary-foreground/90 uppercase">
                            {month}
                          </span>
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/news/${event.slug}`}
                            className="block font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1"
                          >
                            {event.title}
                          </Link>
                          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            {event.event_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.event_time}
                              </div>
                            )}
                            {event.event_location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{event.event_location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No upcoming events scheduled.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary group" asChild>
                  <Link to="/news?category=event">
                    Explore All Events
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
