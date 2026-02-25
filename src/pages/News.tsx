import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock, Bell, Loader2, Newspaper, MapPin, Sparkles, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsEvents, useFeaturedNews, useUpcomingEvents, useSubscribeNewsletter, useSiteSettings } from "@/hooks/use-school-data";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";

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
];

const eventColors = [
  { bg: "bg-gradient-to-br from-violet-500 to-purple-600", ring: "ring-violet-200" },
  { bg: "bg-gradient-to-br from-amber-500 to-orange-600", ring: "ring-amber-200" },
  { bg: "bg-gradient-to-br from-emerald-500 to-teal-600", ring: "ring-emerald-200" },
  { bg: "bg-gradient-to-br from-sky-500 to-blue-600", ring: "ring-sky-200" },
  { bg: "bg-gradient-to-br from-rose-500 to-pink-600", ring: "ring-rose-200" },
];

const News = () => {
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: newsItems = [], isLoading } = useNewsEvents();
  const { data: featured } = useFeaturedNews();
  const { data: upcomingEvents = [] } = useUpcomingEvents();
  const subscribeMutation = useSubscribeNewsletter();
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "";
  const siteUrl = settings?.site_url || "";

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
      day: date.getDate().toString().padStart(2, '0'),
    };
  };

  const stripHtml = (html: string | null | undefined) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         stripHtml(item.excerpt).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "news", "event", "announcement", "achievement"];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <SEOHead
        title={`News & Events | ${schoolName}`}
        description={`Stay updated with the latest news, events, announcements, and achievements from ${schoolName}.`}
        keywords={`${schoolName} news, school events, announcements, achievements`}
        canonicalPath="/news"
        jsonLd={buildBreadcrumbSchema(siteUrl, [{ name: "Home", path: "/" }, { name: "News & Events", path: "/news" }])}
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-rose-100/40 via-pink-50/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-violet-100/40 via-purple-50/20 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 border border-gray-100 rounded-full shadow-sm mb-6 backdrop-blur-sm">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">News & Updates</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
              Stay Connected with <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">Our School Life</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="currentColor" className="text-primary/20" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-black/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore the latest stories, achievements, and events that shape our vibrant community. 
              Be part of our journey towards excellence.
            </p>

            {/* Search & Filter Bar */}
            <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                <input 
                  type="text"
                  placeholder="Search articles, events, news..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-black placeholder:text-black/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-10 w-[1px] bg-gray-100 hidden md:block self-center" />
              <div className="flex items-center gap-2 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-black/60 hover:bg-gray-100"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        {!searchQuery && activeCategory === "all" && featured && (
          <section className="pb-16">
            <div className="container">
              <div className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-black/5 flex flex-col lg:flex-row transition-all duration-500 hover:shadow-primary/5">
                  <div className="lg:w-[420px] lg:shrink-0 relative overflow-hidden h-72 lg:h-auto">
                    <div className="lg:aspect-square w-full h-full">
                      <img
                        src={featured.image_url || "/classroom.png"}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-primary text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 fill-primary" />
                        FEATURED STORY
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${categoryColors[featured.category?.toLowerCase()]?.bg || 'bg-gray-100'} ${categoryColors[featured.category?.toLowerCase()]?.text || 'text-gray-700'}`}>
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-black/40 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featured.event_date || featured.created_at)}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl lg:text-4xl font-bold text-black mb-4 leading-tight group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-black/60 text-base lg:text-lg mb-8 line-clamp-3">
                    {stripHtml(featured.excerpt)}
                  </p>
                  <Button asChild className="w-fit bg-black hover:bg-primary text-white px-8 py-6 rounded-2xl group/btn transition-all">
                    <Link to={`/news/${featured.slug}`}>
                      Read Full Article
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Grid Content */}
        <section className="py-12 pb-32">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* Left Column: Grid of News */}
              <div className="lg:col-span-8">
                {isLoading ? (
                  <div className="grid sm:grid-cols-2 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-[2rem] p-6 animate-pulse shadow-sm">
                        <div className="aspect-video bg-gray-100 rounded-2xl mb-6" />
                        <div className="space-y-4">
                          <div className="h-4 bg-gray-100 rounded w-1/4" />
                          <div className="h-6 bg-gray-100 rounded w-3/4" />
                          <div className="h-4 bg-gray-100 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredNews.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-8">
                    {filteredNews
                      .filter(item => !searchQuery && activeCategory === "all" ? !item.is_featured : true)
                      .map((item, index) => {
                        const accent = cardAccents[index % cardAccents.length];
                        const catColor = categoryColors[item.category?.toLowerCase()] || categoryColors.default;
                        return (
                          <article
                            key={item.id}
                            className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-primary/5"
                          >
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <img
                                src={item.image_url || "/classroom.png"}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                              <div className="absolute top-4 left-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm text-[10px] font-black uppercase tracking-wider ${catColor.bg} ${catColor.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
                                  {item.category}
                                </span>
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                              <div className="flex items-center gap-2 text-black/40 text-[11px] font-bold uppercase tracking-widest mb-3">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(item.event_date || item.created_at)}
                              </div>
                              <h3 className="font-heading text-lg font-bold text-black mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                {item.title}
                              </h3>
                                <p className="text-black/60 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                                  {stripHtml(item.excerpt) || item.title}
                                </p>
                              <Link
                                to={`/news/${item.slug}`}
                                className={`inline-flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent group/link`}
                              >
                                READ STORY
                                <ArrowRight className="w-4 h-4 text-black/80 transition-transform group-hover/link:translate-x-1" />
                              </Link>
                            </div>
                          </article>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">No articles found</h3>
                    <p className="text-black/40">Try adjusting your search or category filters.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Upcoming Events Widget */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Calendar</span>
                      <Calendar className="w-5 h-5 text-white/40" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">Upcoming Events</h3>
                  </div>

                  <div className="p-4 space-y-2">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.slice(0, 5).map((event, index) => {
                        const { day, month } = formatEventDate(event.event_date || event.created_at);
                        const eColor = eventColors[index % eventColors.length];
                        return (
                          <div key={event.id} className="group flex gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-all duration-300">
                            <div className={`w-14 h-14 shrink-0 rounded-2xl ${eColor.bg} flex flex-col items-center justify-center shadow-lg shadow-black/5 ring-4 ring-white`}>
                              <span className="text-lg font-black text-white leading-none">{day}</span>
                              <span className="text-[10px] font-bold text-white/80 uppercase">{month}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/news/${event.slug}`} className="block font-bold text-black hover:text-primary transition-colors text-sm line-clamp-2 mb-1">
                                {event.title}
                              </Link>
                              <div className="flex flex-col gap-1 text-[11px] text-black/50 font-medium">
                                {event.event_time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {event.event_time}
                                  </span>
                                )}
                                {event.event_location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-primary/60" /> <span className="truncate">{event.event_location}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-black/40 text-sm font-medium">No scheduled events</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 pt-2">
                    <Button variant="outline" asChild className="w-full rounded-2xl py-6 border-2 border-gray-100 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <Link to="/news?category=event">View Full Calendar</Link>
                    </Button>
                  </div>
                </div>

                {/* Newsletter Card */}
                <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold mb-3 leading-tight">Never Miss an <br />Update Again</h3>
                    <p className="text-white/80 text-sm mb-8 leading-relaxed">
                      Get the latest news, success stories and event invites delivered straight to your inbox.
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-5 py-4 rounded-2xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm font-medium"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        variant="gold" 
                        className="w-full py-6 rounded-2xl font-bold shadow-lg shadow-black/10 hover:-translate-y-1 transition-all"
                        disabled={subscribeMutation.isPending}
                      >
                        {subscribeMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          "Join the Community"
                        )}
                      </Button>
                    </form>
                    <p className="text-[10px] text-white/40 text-center mt-4 uppercase tracking-widest font-bold">
                      Zero spam. Unsubscribe anytime.
                    </p>
                  </div>
                </div>

                {/* Quick Links Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                  <h4 className="font-heading text-xl font-bold text-black mb-6">Quick Categories</h4>
                  <div className="space-y-3">
                    {categories.slice(1).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm ${
                          activeCategory === cat 
                            ? "bg-primary/5 text-primary" 
                            : "bg-gray-50 text-black/60 hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${categoryColors[cat]?.dot || 'bg-gray-300'}`} />
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </span>
                        <ArrowRight className={`w-4 h-4 transition-transform ${activeCategory === cat ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
                      </button>
                    ))}
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
