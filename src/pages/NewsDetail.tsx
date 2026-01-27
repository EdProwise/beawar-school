import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewsBySlug } from "@/hooks/use-school-data";

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: news, isLoading } = useNewsBySlug(slug);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">News Not Found</h1>
          <p className="text-muted-foreground mb-8">The news article you are looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link to="/news">Back to News</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 hover:bg-secondary">
            <Link to="/news" className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
          </Button>

          <article>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="px-3 py-1 bg-primary-light text-primary rounded-full font-medium capitalize">
                {news.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {formatDate(news.event_date || news.created_at)}
              </span>
              {news.event_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {news.event_time}
                </span>
              )}
              {news.event_location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {news.event_location}
                </span>
              )}
            </div>

            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
              {news.title}
            </h1>

            {news.image_url && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: news.content || "" }}
            />

            <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <Share2 className="w-4 h-4" /> Share Article
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/news" className="text-primary hover:underline font-medium">
                  Next Article
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NewsDetail;
