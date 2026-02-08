import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock, Bell, Loader2, Sparkles, Star, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents, useFeaturedNews, useUpcomingEvents, useSubscribeNewsletter } from "@/hooks/use-school-data";

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string; glow: string; badge: string }> = {
  events: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-200/50", badge: "bg-gradient-to-r from-violet-500 to-purple-600" },
  announcement: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", gradient: "from-rose-500 to-pink-600", glow: "shadow-rose-200/50", badge: "bg-gradient-to-r from-rose-500 to-pink-600" },
  achievements: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-500 to-orange-600", glow: "shadow-amber-200/50", badge: "bg-gradient-to-r from-amber-500 to-orange-600" },
  sports: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-200/50", badge: "bg-gradient-to-r from-emerald-500 to-teal-600" },
  academic: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-500 to-cyan-600", glow: "shadow-blue-200/50", badge: "bg-gradient-to-r from-blue-500 to-cyan-600" },
  cultural: { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200", gradient: "from-fuchsia-500 to-pink-600", glow: "shadow-fuchsia-200/50", badge: "bg-gradient-to-r from-fuchsia-500 to-pink-600" },
};

const getColor = (cat: string | undefined) =>
  categoryColors[(cat || "").toLowerCase()] || categoryColors.events;

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
        <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="container relative text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" /> News & Events
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Latest Updates
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Stay informed about the latest happenings at our school
            </p>
          </div>
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none">
            <path d="M0 60V20C360 0 720 40 1080 20C1260 10 1380 30 1440 20V60H0Z" fill="white" />
          </svg>
        </section>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="rounded-2xl p-6 animate-pulse bg-gray-50 border border-gray-100">
                        <div className="h-52 bg-gray-200/60 rounded-xl mb-4" />
                        <div className="h-6 bg-gray-200/60 rounded-lg w-3/4 mb-3" />
                        <div className="h-4 bg-gray-200/60 rounded-lg w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Featured Article */}
                    {featured && (() => {
                      const color = getColor(featured.category);
                      return (
                        <article className="mb-10 group relative">
                          {/* Gradient glow behind card */}
                          <div className={`absolute -inset-1 bg-gradient-to-r ${color.gradient} rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500`} />
                          <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* Image section */}
                            <div className="relative overflow-hidden">
                              <img
                                src={featured.image_url || "/classroom.png"}
                                alt={featured.title}
                                className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              {/* Gradient overlay */}
                              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent`} />
                              {/* Badges */}
                              <div className="absolute top-5 left-5 flex items-center gap-2">
                                <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg shadow-amber-300/40 flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 fill-current" /> Featured
                                </span>
                                <span className={`px-3 py-1.5 ${color.badge} text-white text-xs font-semibold rounded-full capitalize shadow-lg`}>
                                  {featured.category}
                                </span>
                              </div>
                              {/* Date on image */}
                              <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white/90 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{formatDate(featured.event_date || featured.created_at)}</span>
                              </div>
                            </div>
                            {/* Content */}
                            <div className="p-6 md:p-8">
                              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                {featured.title}
                              </h2>
                              <p className="text-gray-500 mb-6 line-clamp-2 leading-relaxed">{stripHtml(featured.excerpt)}</p>
                              <Link
                                to={`/news/${featured.slug}`}
                                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${color.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
                              >
                                Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })()}

                    {/* Other News Grid */}
                    <div className="space-y-5">
                      {otherNews.map((item, index) => {
                        const color = getColor(item.category);
                        // Alternate between colorful layouts
                        const isWide = index === 0;
                        return isWide ? (
                          /* Wide card layout for first item */
                          <article key={item.id} className="group relative">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${color.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
                            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500">
                              <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden">
                                  <img
                                    src={item.image_url || "/classroom.png"}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                  <div className={`absolute inset-0 bg-gradient-to-r ${color.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                                  {/* Color accent bar */}
                                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color.gradient}`} />
                                </div>
                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 ${color.badge} text-white text-xs font-bold rounded-full capitalize`}>
                                      {item.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                      <Calendar className="w-3.5 h-3.5" /> {formatDate(item.event_date || item.created_at)}
                                    </span>
                                  </div>
                                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                    {item.title}
                                  </h3>
                                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{stripHtml(item.excerpt)}</p>
                                  <Link
                                    to={`/news/${item.slug}`}
                                    className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent hover:gap-3 transition-all duration-300`}
                                  >
                                    Read More <ArrowRight className={`w-4 h-4 ${color.text}`} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </article>
                        ) : (
                          /* Compact card with colorful left accent */
                          <article key={item.id} className="group relative">
                            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-0.5">
                              <div className="flex flex-col sm:flex-row">
                                {/* Colorful gradient sidebar accent */}
                                <div className={`hidden sm:block w-1.5 bg-gradient-to-b ${color.gradient} shrink-0`} />
                                {/* Image */}
                                <div className="relative sm:w-44 h-44 sm:h-auto overflow-hidden shrink-0">
                                  <img
                                    src={item.image_url || "/classroom.png"}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-5 group-hover:opacity-15 transition-opacity`} />
                                </div>
                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col justify-center">
                                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${color.bg} ${color.text} ${color.border} border text-xs font-bold rounded-lg capitalize`}>
                                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color.gradient}`} />
                                      {item.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                                      <Calendar className="w-3 h-3" /> {formatDate(item.event_date || item.created_at)}
                                    </span>
                                  </div>
                                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-1.5 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-1">
                                    {item.title}
                                  </h3>
                                  <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">{stripHtml(item.excerpt)}</p>
                                  <Link
                                    to={`/news/${item.slug}`}
                                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${color.text} hover:gap-3 transition-all duration-300`}
                                  >
                                    Read More <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div className="relative rounded-2xl overflow-hidden">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 rounded-2xl" />
                  <div className="relative m-[2px] bg-white rounded-[14px] p-6">
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </span>
                      Upcoming Events
                    </h3>
                    <div className="space-y-3">
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event, i) => {
                          const { month, day } = formatEventDate(event.event_date || event.created_at);
                          const colors = [
                            "from-violet-500 to-purple-600",
                            "from-rose-500 to-pink-600",
                            "from-amber-500 to-orange-600",
                            "from-emerald-500 to-teal-600",
                            "from-blue-500 to-cyan-600",
                          ];
                          const grad = colors[i % colors.length];
                          return (
                            <div key={event.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors group/event">
                              <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${grad} text-white flex flex-col items-center justify-center shadow-md`}>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{month}</span>
                                <span className="text-xl font-extrabold leading-none">{day}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 text-sm truncate group-hover/event:text-violet-600 transition-colors">{event.title}</h4>
                                {event.event_time && (
                                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" /> {event.event_time}
                                  </p>
                                )}
                                {event.event_location && (
                                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" /> {event.event_location}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-sm text-center py-6">
                          No upcoming events scheduled.
                        </p>
                      )}
                    </div>
                    <Link
                      to="/news"
                      className="flex items-center justify-center gap-2 w-full mt-5 py-2.5 rounded-xl border-2 border-violet-200 text-violet-600 font-semibold text-sm hover:bg-violet-50 transition-colors"
                    >
                      View All Events <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Trending Section */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl" />
                  <div className="relative">
                    <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </span>
                      Trending
                    </h3>
                    <div className="space-y-3">
                      {newsItems.slice(0, 4).map((item, i) => (
                        <Link
                          key={item.id}
                          to={`/news/${item.slug}`}
                          className="flex items-start gap-3 group/trend hover:bg-white/5 rounded-lg p-2 -mx-2 transition-colors"
                        >
                          <span className="text-2xl font-black bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent leading-none mt-0.5">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white/90 line-clamp-2 group-hover/trend:text-amber-300 transition-colors leading-snug">
                              {item.title}
                            </h4>
                            <span className="text-xs text-white/40 mt-0.5 block">{formatDate(item.event_date || item.created_at)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-600" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl translate-y-8 -translate-x-8" />
                  <div className="relative p-6 text-white">
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-white/75 text-sm mb-5 leading-relaxed">
                      Subscribe to receive latest news and updates directly to your inbox
                    </p>
                    <form onSubmit={handleSubscribe}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 mb-3 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        required
                      />
                      <button
                        type="submit"
                        disabled={subscribeMutation.isPending}
                        className="w-full py-3 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 disabled:opacity-70"
                      >
                        {subscribeMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          "Subscribe Now"
                        )}
                      </button>
                    </form>
                  </div>
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
