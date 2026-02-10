import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MapPin, Clock, Newspaper, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents, useUpcomingEvents } from "@/hooks/use-school-data";

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  news: { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
  event: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  announcement: { bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500" },
  achievement: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  default: { bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" },
};

const cardAccents = [
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-violet-600",
];

const eventColors = [
  { bg: "bg-gradient-to-br from-violet-500 to-purple-600", ring: "ring-violet-200" },
  { bg: "bg-gradient-to-br from-amber-500 to-orange-600", ring: "ring-amber-200" },
  { bg: "bg-gradient-to-br from-emerald-500 to-teal-600", ring: "ring-emerald-200" },
  { bg: "bg-gradient-to-br from-sky-500 to-blue-600", ring: "ring-sky-200" },
  { bg: "bg-gradient-to-br from-rose-500 to-pink-600", ring: "ring-rose-200" },
];

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
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Multi-color background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/60" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-rose-200/30 via-pink-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-violet-200/30 via-purple-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-100/20 via-yellow-100/10 to-transparent rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-violet-500/10 border border-rose-200/60 rounded-full mb-6">
            <Newspaper className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">News & Updates</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Latest{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-violet-600 bg-clip-text text-transparent">Updates</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="url(#news-grad)" strokeWidth="3" strokeLinecap="round"/>
                <defs><linearGradient id="news-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#e11d48"/><stop offset="0.5" stopColor="#ec4899"/><stop offset="1" stopColor="#7c3aed"/></linearGradient></defs>
              </svg>
            </span>
            {" "}& Events
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Stay informed about the latest happenings and upcoming events at our school
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Latest News - Left */}
          <div className="lg:w-[72%]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {isLoadingNews ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 animate-pulse shadow-sm">
                    <div className="aspect-video bg-gray-100 rounded-2xl mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded-lg w-1/4" />
                      <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
                      <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                    </div>
                  </div>
                ))
              ) : newsItems.length > 0 ? (
                newsItems.map((item, index) => {
                  const catColor = categoryColors[item.category?.toLowerCase()] || categoryColors.default;
                  const accent = cardAccents[index % cardAccents.length];
                  return (
                    <article
                      key={item.id}
                      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent flex flex-col h-full transition-all duration-500 hover:-translate-y-2"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0,0,0,0.12)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                    >
                      {/* Gradient top accent */}
                      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />

                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={item.image_url || "/classroom.png"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        
                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${catColor.bg} ${catColor.text} text-xs font-bold rounded-full backdrop-blur-sm shadow-sm`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
                            {item.category}
                          </span>
                        </div>

                        {/* Decorative corner */}
                        <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-20 transition-all duration-500 group-hover:-bottom-4 group-hover:-right-4`} />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(item.created_at)}
                        </div>
                        <h3 className="font-heading text-base font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                          {stripHtml(item.excerpt)}
                        </p>
                        <Link
                          to={item.slug ? `/news/${item.slug}` : "/news"}
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r ${accent} bg-clip-text text-transparent mt-auto group/link`}
                        >
                          Read More 
                          <ArrowRight className="w-4 h-4 text-gray-400 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16">
                  <Newspaper className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No news articles available.</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild className="bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 hover:from-rose-700 hover:via-pink-700 hover:to-violet-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-0.5">
                <Link to="/news">
                  <Sparkles className="w-5 h-5 mr-2" />
                  View All News
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Upcoming Events - Right */}
          <div className="lg:w-[28%]">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow duration-500">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-amber-300" />
                      <span className="text-violet-200 text-xs font-semibold uppercase tracking-wider">Upcoming</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white">Events</h3>
                  </div>
                  <Link to="/news?category=event" className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </Link>
                </div>
              </div>

              <div className="p-5 space-y-1">
                {isLoadingEvents ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse p-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-100 rounded-lg w-full" />
                        <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
                      </div>
                    </div>
                  ))
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => {
                    const { day, month } = formatEventDate(event.event_date);
                    const eColor = eventColors[index % eventColors.length];
                    return (
                      <div key={event.id} className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                        {/* Date Box */}
                        <div className={`w-14 h-14 ${eColor.bg} rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm ring-2 ${eColor.ring} transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}>
                          <span className="text-lg font-bold text-white leading-none">
                            {day}
                          </span>
                          <span className="text-[10px] font-bold text-white/80 uppercase">
                            {month}
                          </span>
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/news/${event.slug}`}
                            className="block font-semibold text-gray-900 hover:text-violet-600 transition-colors line-clamp-2 text-sm mb-1"
                          >
                            {event.title}
                          </Link>
                          <div className="flex flex-col gap-0.5 text-xs text-gray-400">
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
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-gray-400 text-sm">No upcoming events scheduled.</p>
                  </div>
                )}
              </div>

              <div className="px-5 pb-5">
                <Link 
                  to="/news?category=event" 
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-violet-600 font-semibold text-sm transition-all duration-300 group"
                >
                  Explore All Events
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
