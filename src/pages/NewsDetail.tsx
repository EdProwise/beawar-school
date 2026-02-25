import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Check, Loader2, Bookmark, ArrowRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsBySlug, useNewsEvents, useSiteSettings } from "@/hooks/use-school-data";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: news, isLoading } = useNewsBySlug(slug);
  const { data: moreNews = [] } = useNewsEvents(4);
  const { data: siteSettings } = useSiteSettings();
  const schoolName = siteSettings?.school_name || "";
  const siteUrl = siteSettings?.site_url || "";
  const contentRef = useRef<HTMLDivElement>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = news?.title || "School News";
    const text = news?.excerpt?.replace(/<[^>]+>/g, "") || title;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  useEffect(() => {
    if (news) {
      const images: string[] = [];
      if (news.image_url) images.push(news.image_url);
      
      // We'll also scan the content for images after a short delay to ensure it's rendered
      const timeout = setTimeout(() => {
        if (contentRef.current) {
          const contentImages = contentRef.current.querySelectorAll('img');
          contentImages.forEach(img => {
            if (img.src && !images.includes(img.src)) {
              images.push(img.src);
            }
          });
          setAllImages(images);
        } else {
          setAllImages(images);
        }
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [news]);

  const handleImageClick = (src: string) => {
    const index = allImages.indexOf(src);
    if (index !== -1) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    } else {
      // If it's not in the list yet, add it and open
      setAllImages(prev => [...prev, src]);
      setCurrentImageIndex(allImages.length);
      setLightboxOpen(true);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const otherArticles = moreNews.filter(item => item.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/30">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/30">
        <Header />
        <main className="flex-1 container py-32 text-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Article Not Found</h1>
          <p className="text-black/60 mb-8 max-w-md mx-auto">The news article you are looking for does not exist or has been moved.</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/news">Back to News Feed</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <SEOHead
        title={news?.title ? `${news.title} | ${schoolName}` : `News | ${schoolName}`}
        description={news?.excerpt || news?.content?.replace(/<[^>]+>/g, "").substring(0, 160) || `Latest news and events from ${schoolName}.`}
        keywords={`news, events, ${schoolName}, ${news?.category || "school news"}`}
        ogImage={news?.image_url || undefined}
        ogType="article"
        canonicalPath={`/news/${slug}`}
        jsonLd={buildBreadcrumbSchema(siteUrl, [{ name: "Home", path: "/" }, { name: "News", path: "/news" }, { name: news?.title || "Article", path: `/news/${slug}` }])}
      />
      <Header />
      <main className="flex-1 pt-32 pb-32">
        <div className="container max-w-5xl">
          {/* Breadcrumb / Back Button */}
          <Link 
            to="/news" 
            className="inline-flex items-center gap-2 text-black/40 hover:text-primary font-bold text-sm mb-12 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO ALL NEWS
          </Link>

          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <article className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider">
                    {news.category}
                  </span>
                  <div className="flex items-center gap-4 text-black/40 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {formatDate(news.event_date || news.created_at)}
                    </span>
                    {news.event_time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {news.event_time}
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="font-heading text-3xl md:text-5xl font-bold text-black mb-10 leading-tight">
                  {news.title}
                </h1>

                {news.image_url && (
                  <div 
                    className="relative aspect-video rounded-[2rem] overflow-hidden mb-12 shadow-2xl shadow-black/10 cursor-zoom-in group/main-img"
                    onClick={() => handleImageClick(news.image_url!)}
                  >
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/main-img:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/main-img:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 scale-90 group-hover/main-img:scale-100 transition-transform duration-500">
                        <ZoomIn className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                )}

                {news.event_location && (
                  <div className="flex items-start gap-3 p-6 bg-gray-50 rounded-2xl mb-12 border border-gray-100">
                    <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">Event Location</p>
                      <p className="text-black font-bold">{news.event_location}</p>
                    </div>
                  </div>
                )}

                  {news.content ? (
                    <div 
                      ref={contentRef}
                      className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-black prose-p:text-black/70 prose-p:leading-relaxed prose-img:rounded-[2rem] prose-img:cursor-zoom-in hover:prose-img:shadow-2xl transition-all prose-img:duration-500 prose-a:text-primary prose-strong:text-black prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:font-bold"
                      dangerouslySetInnerHTML={{ __html: news.content }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.tagName === 'IMG') {
                          handleImageClick((target as HTMLImageElement).src);
                        }
                      }}
                    />
                  ) : (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-black/60 leading-relaxed">
                        {news.excerpt
                          ? news.excerpt.replace(/<[^>]+>/g, "")
                          : `Details about "${news.title}" have not been added yet. Please check back later or contact the school for more information.`}
                      </p>
                    </div>
                  )}

                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleShare}
                        className="rounded-2xl gap-2 font-bold hover:bg-black hover:text-white transition-all"
                      >
                        {shared ? (
                          <><Check className="w-4 h-4 text-green-500" /> Link Copied!</>
                        ) : (
                          <><Share2 className="w-4 h-4" /> Share Article</>
                        )}
                      </Button>
                  </div>

                </div>
              </article>
            </div>

            {/* Sidebar for More Articles */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-32">
                <h3 className="font-heading text-xl font-bold text-black mb-8 flex items-center justify-between">
                  Latest Stories
                  <Link to="/news" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</Link>
                </h3>
                
                <div className="space-y-8">
                  {otherArticles.map((article) => (
                    <Link key={article.id} to={`/news/${article.slug}`} className="group block">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                          <img 
                            src={article.image_url || "/classroom.png"} 
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{article.category}</p>
                          <h4 className="font-bold text-black text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2">
                            {article.title}
                          </h4>
                          <p className="text-[10px] font-bold text-black/30 flex items-center gap-1.5 uppercase">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.event_date || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Newsletter Widget - Minimal version */}
                <div className="mt-16 p-8 bg-black rounded-[2.5rem] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                  <div className="relative z-10">
                    <h4 className="font-heading text-lg font-bold mb-4">Stay in the loop</h4>
                    <p className="text-white/50 text-xs mb-6 leading-relaxed">Join our weekly newsletter and get the latest school updates directly.</p>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Email..." 
                        className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-white/30"
                      />
                      <Button size="icon" className="bg-primary hover:bg-primary-dark rounded-xl shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ImageLightbox 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        initialIndex={currentImageIndex}
      />
    </div>
  );
}

export default NewsDetail;
