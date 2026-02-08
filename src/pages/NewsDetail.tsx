import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Loader2, Play, BookOpen, Tag, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsBySlug } from "@/hooks/use-school-data";
import { useState } from "react";

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: news, isLoading } = useNewsBySlug(slug);
  const [showVideo, setShowVideo] = useState(false);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: news?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 blur-lg opacity-40 animate-pulse" />
              <Loader2 className="w-10 h-10 animate-spin text-violet-600 relative" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50" />
          <div className="relative container py-32 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 mb-6 shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-700 via-rose-600 to-amber-600 bg-clip-text text-transparent">
              News Not Found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The news article you are looking for does not exist or has been removed.
            </p>
            <Button asChild className="bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 text-white border-0 rounded-full px-8 shadow-lg shadow-violet-200">
              <Link to="/news">Back to News</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    event: "from-violet-500 to-purple-600",
    announcement: "from-rose-500 to-pink-600",
    achievement: "from-amber-500 to-orange-600",
    sports: "from-emerald-500 to-teal-600",
    academic: "from-blue-500 to-indigo-600",
    cultural: "from-fuchsia-500 to-pink-600",
  };

  const categoryBg: Record<string, string> = {
    event: "bg-violet-50 text-violet-700 ring-violet-200",
    announcement: "bg-rose-50 text-rose-700 ring-rose-200",
    achievement: "bg-amber-50 text-amber-700 ring-amber-200",
    sports: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    academic: "bg-blue-50 text-blue-700 ring-blue-200",
    cultural: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
  };

  const gradientClass = categoryColors[news.category?.toLowerCase()] || "from-violet-500 to-rose-600";
  const badgeClass = categoryBg[news.category?.toLowerCase()] || "bg-violet-50 text-violet-700 ring-violet-200";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section with gradient background */}
        <section className="relative pt-28 pb-16 overflow-hidden">
          {/* Multi-color gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-rose-500 to-amber-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-transparent to-transparent" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-cyan-300/10 rounded-full blur-2xl" />

          <div className="container max-w-5xl relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/news" className="hover:text-white transition-colors">News</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/90 truncate max-w-[200px]">{news.title}</span>
            </nav>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold ring-1 ring-white/30 capitalize">
                <Tag className="w-3.5 h-3.5" />
                {news.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/90 text-sm">
                <Calendar className="w-4 h-4" /> {formatDate(news.event_date || news.created_at)}
              </span>
              {news.event_time && (
                <span className="flex items-center gap-1.5 text-white/90 text-sm">
                  <Clock className="w-4 h-4" /> {news.event_time}
                </span>
              )}
              {news.event_location && (
                <span className="flex items-center gap-1.5 text-white/90 text-sm">
                  <MapPin className="w-4 h-4" /> {news.event_location}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight break-words max-w-4xl">
              {news.title}
            </h1>
          </div>

          {/* Bottom wave/curve */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V30C240 5 480 0 720 15C960 30 1200 45 1440 30V60H0Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative pb-20 -mt-2">
          <div className="container max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Featured Image/Video */}
                {(news.image_url || news.video_url) && (
                  <div className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl shadow-violet-200/40 ring-1 ring-black/5 group">
                    <div className="aspect-video">
                      {news.video_url && showVideo ? (
                        <video
                          src={news.video_url}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                      ) : news.image_url ? (
                        <>
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Gradient overlay on image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          {news.video_url && (
                            <button
                              onClick={() => setShowVideo(true)}
                              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                            >
                              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-rose-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white ml-1" />
                              </div>
                            </button>
                          )}
                        </>
                      ) : news.video_url ? (
                        <video
                          src={news.video_url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Article Body */}
                <div
                  className="prose prose-lg max-w-none 
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:bg-gradient-to-r prose-h2:from-violet-700 prose-h2:to-rose-600 prose-h2:bg-clip-text prose-h2:text-transparent
                    prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:text-[1.05rem]
                    prose-a:text-violet-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-gradient-to-b prose-blockquote:border-violet-400 prose-blockquote:bg-violet-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-6
                    prose-strong:text-gray-900
                    prose-li:text-gray-600
                    break-words"
                  dangerouslySetInnerHTML={{ __html: news.content || "" }}
                />

                {/* Bottom Actions */}
                <div className="mt-14 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="rounded-full gap-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 hover:border-violet-300 transition-all"
                      >
                        <Share2 className="w-4 h-4" /> Share Article
                      </Button>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 capitalize ${badgeClass}`}>
                        <Sparkles className="w-3 h-3" />
                        {news.category}
                      </span>
                    </div>
                    <Button asChild variant="ghost" className="rounded-full gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                      <Link to="/news">
                        View All News <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:w-72 shrink-0">
                <div className="lg:sticky lg:top-28 space-y-6">
                  {/* Quick Info Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 p-6 ring-1 ring-violet-100/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-rose-500" />
                      Quick Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm text-gray-800 font-semibold">{formatDate(news.event_date || news.created_at)}</p>
                        </div>
                      </div>
                      {news.event_time && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-rose-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Time</p>
                            <p className="text-sm text-gray-800 font-semibold">{news.event_time}</p>
                          </div>
                        </div>
                      )}
                      {news.event_location && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="text-sm text-gray-800 font-semibold">{news.event_location}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <Tag className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Category</p>
                          <p className="text-sm text-gray-800 font-semibold capitalize">{news.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back to News CTA */}
                  <Link
                    to="/news"
                    className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 p-[2px] shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-violet-300/50 transition-all"
                  >
                    <span className="flex items-center gap-3 w-full rounded-[14px] bg-white px-5 py-4 group-hover:bg-transparent transition-colors">
                      <ArrowLeft className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                      <span className="font-semibold text-sm text-gray-800 group-hover:text-white transition-colors">
                        Back to All News
                      </span>
                    </span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NewsDetail;
