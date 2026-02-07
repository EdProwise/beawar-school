import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents, useFeaturedNews, useUpcomingEvents, useSubscribeNewsletter } from "@/hooks/use-school-data";

const News = () => {
  const [email, setEmail] = useState("");
  const { data: newsItems = [], isLoading } = useNewsEvents();
  const { data: featured } = useFeaturedNews();
  const { data: upcomingEvents = [] } = useUpcomingEvents();
  const subscribeMutation = useSubscribeNewsletter();

  const otherNews = newsItems.filter(item => !item.is_featured).slice(0, 5);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email }, {
      onSuccess: () => setEmail(""),
    });
  };

    const formatDate = (dateStr: string | null | undefined) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatEventDate = (dateStr: string | null | undefined) => {
      if (!dateStr) return { month: "N/A", day: "--" };
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { month: "N/A", day: "--" };
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: date.getDate().toString(),
      };
    };

    const stripHtml = (html: string | null | undefined) => {
      if (!html) return "";
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
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
              News & Events
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Latest Updates
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Stay informed about the latest happenings at Orbit School
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                        <div className="h-48 bg-secondary rounded-lg mb-4" />
                        <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
                        <div className="h-4 bg-secondary rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Featured Article */}
                    {featured && (
                      <article className="mb-8 group">
                        <div className="relative overflow-hidden rounded-2xl mb-6">
                          <img
                            src={featured.image_url || "/classroom.png"}
                            alt={featured.title}
                            className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                          <span className="px-3 py-1 bg-primary-light text-primary rounded-full font-medium capitalize">
                            {featured.category}
                          </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" /> {formatDate(featured.event_date || featured.created_at)}
                            </span>
                        </div>
                          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {featured.title}
                          </h2>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{stripHtml(featured.excerpt)}</p>
                          <Button variant="outline" asChild>

                          <Link to={`/news/${featured.slug}`}>Read Full Story <ArrowRight className="w-4 h-4" /></Link>
                        </Button>
                      </article>
                    )}

                    {/* Other News */}
                    <div className="space-y-6">
                      {otherNews.map((item) => (
                        <article
                          key={item.id}
                          className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-medium transition-all flex flex-col sm:flex-row"
                        >
                          <div className="relative sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                            <img
                              src={item.image_url || "/classroom.png"}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full capitalize">
                                {item.category}
                              </span>
                            </div>
                          </div>
                            <div className="p-5 flex-1">
                              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(item.event_date || item.created_at)}
                              </div>
                              <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{stripHtml(item.excerpt)}</p>
                              <Link
                                to={`/news/${item.slug}`}

                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                            >
                              Read More <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Upcoming Events */}
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 mb-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-6 pb-4 border-b border-border flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Upcoming Events
                  </h3>
                  <div className="space-y-4">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => {
                        const { month, day } = formatEventDate(event.event_date || event.created_at);
                        return (
                          <div key={event.id} className="flex gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex flex-col items-center justify-center">
                                <span className="text-xs font-medium">{month}</span>
                                <span className="text-lg font-bold">{day}</span>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-foreground text-sm truncate">{event.title}</h4>
                              {event.event_time && (
                                <p className="text-muted-foreground text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {event.event_time}
                                </p>
                              )}
                              {event.event_location && (
                                <p className="text-muted-foreground text-xs">{event.event_location}</p>
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

                {/* Newsletter */}
                <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                  <Bell className="w-10 h-10 mb-4" />
                  <h3 className="font-heading text-lg font-semibold mb-2">Stay Updated</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Subscribe to receive latest news and updates
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mb-3"
                      required
                    />
                    <Button 
                      type="submit" 
                      variant="gold" 
                      size="sm" 
                      className="w-full"
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
