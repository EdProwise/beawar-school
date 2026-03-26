import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBlogPostBySlug, useBlogPosts, useSiteSettings } from "@/hooks/use-school-data";
import { FormattedContent } from "@/components/ui/formatted-content";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";
import {
  Loader2, Calendar, Clock, User, Tag, ArrowLeft, BookOpen,
  ChevronRight, Bookmark, Share2,
} from "lucide-react";

function formatDate(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return new DOMParser().parseFromString(html, "text/html").body.textContent || "";
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPostBySlug(slug || "");
  const { data: allPosts = [] } = useBlogPosts();
  const { data: siteSettings } = useSiteSettings();

  const schoolName = siteSettings?.school_name || "";
  const siteUrl = siteSettings?.site_url || "";

  // Recent posts — same category first, then others, exclude current
  const recentPosts = allPosts
    .filter(p => p.id !== post?.id)
    .sort((a, b) => {
      const sameCatA = a.category === post?.category ? 0 : 1;
      const sameCatB = b.category === post?.category ? 0 : 1;
      return sameCatA - sameCatB || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-primary/30" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Post Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            This blog post doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | ${schoolName}`}
        description={stripHtml(post.excerpt) || stripHtml(post.content)?.slice(0, 160)}
        keywords={post.tags?.join(", ") || `${schoolName} blog`}
        canonicalPath={`/blog/${post.slug}`}
        jsonLd={buildBreadcrumbSchema(siteUrl, [
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <Header />

      <main className="pb-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        {post.cover_image_url ? (
          <div className="relative w-full h-[50vh] md:h-[62vh] overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover scale-105"
              style={{ objectPosition: "center 30%" }}
            />
            {/* Multi-layer gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end pb-12">
              <div className="container max-w-5xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-white/60 text-xs font-medium mb-5">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="w-3 h-3" />
                  <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white/80 truncate max-w-[200px]">{post.title}</span>
                </nav>

                {post.category && (
                  <span className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full mb-4 shadow-lg">
                    {post.category}
                  </span>
                )}
                <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl drop-shadow-lg">
                  {post.title}
                </h1>

                {/* Meta bar */}
                <div className="flex flex-wrap items-center gap-5 mt-6 text-white/70 text-sm">
                  {post.author_name && (
                    <div className="flex items-center gap-2">
                      {post.author_avatar ? (
                        <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="font-semibold text-white">{post.author_name}</span>
                    </div>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {formatDate(post.created_at)}
                  </span>
                  {post.read_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {post.read_time} min read
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No cover image — solid gradient hero */
          <div className="pt-28 pb-12 bg-gradient-to-b from-primary/8 via-background to-background border-b border-border">
            <div className="container max-w-5xl">
              <nav className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground/70 truncate max-w-[200px]">{post.title}</span>
              </nav>
              {post.category && (
                <span className="inline-flex items-center px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full mb-5">
                  {post.category}
                </span>
              )}
              <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-foreground leading-tight max-w-4xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 mt-6 text-muted-foreground text-sm">
                {post.author_name && (
                  <div className="flex items-center gap-2">
                    {post.author_avatar ? (
                      <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <span className="font-semibold text-foreground">{post.author_name}</span>
                  </div>
                )}
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.created_at)}</span>
                {post.read_time && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.read_time} min read</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Two-Column Layout ──────────────────────────────────────── */}
        <div className="container max-w-6xl mt-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* ── Left: Article Content ───────────────────────────────────── */}
            <article className="flex-1 min-w-0">

              {/* Excerpt pull-quote */}
              {post.excerpt && (
                <div className="relative mb-10 pl-6 border-l-4 border-primary">
                  <div className="absolute -left-2 top-0 w-3 h-3 rounded-full bg-primary" />
                  <p className="text-lg md:text-xl text-foreground/70 font-medium leading-relaxed italic">
                    {stripHtml(post.excerpt)}
                  </p>
                </div>
              )}

              {/* Article body — FormattedContent preserves all Quill formatting */}
              <div className="text-foreground/85 text-base md:text-[1.05rem] leading-[1.85]">
                <FormattedContent content={post.content || ""} />
              </div>

              {/* ── Tags ─────────────────────────────────────────────────── */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border">
                  <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-primary/8 text-primary rounded-full text-xs font-semibold border border-primary/15 hover:bg-primary/15 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Author Card ───────────────────────────────────────────── */}
              {post.author_name && (
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 flex items-start gap-5">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt={post.author_name} className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/15 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/15 shrink-0">
                      <User className="w-8 h-8 text-primary/50" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Written by</p>
                    <h4 className="font-heading text-lg font-bold text-foreground">{post.author_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{schoolName}</p>
                  </div>
                </div>
              )}

              {/* ── Back button ───────────────────────────────────────────── */}
              <div className="mt-10 flex items-center gap-3">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>
              </div>
            </article>

            {/* ── Right: Sidebar ──────────────────────────────────────────── */}
            <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-28">

              {/* Recent Posts card */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                {/* Card header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-white/80" />
                    <h3 className="font-heading font-bold text-white text-base">Recent Posts</h3>
                  </div>
                </div>

                {recentPosts.length > 0 ? (
                  <div className="divide-y divide-border">
                    {recentPosts.map((p, idx) => (
                      <Link
                        key={p.id}
                        to={`/blog/${p.slug}`}
                        className="group flex items-start gap-3 p-4 hover:bg-primary/4 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                          {p.cover_image_url ? (
                            <img
                              src={p.cover_image_url}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/8">
                              <BookOpen className="w-5 h-5 text-primary/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {p.category && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-primary block mb-0.5">
                              {p.category}
                            </span>
                          )}
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {p.title}
                          </h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> {formatShortDate(p.created_at)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No other posts yet.
                  </div>
                )}

                <div className="p-4 border-t border-border">
                  <Link
                    to="/blog"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/8 text-primary text-sm font-semibold hover:bg-primary/15 transition-colors"
                  >
                    View All Posts <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Category badge (if exists) */}
              {post.category && (
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Category</h4>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">
                    <BookOpen className="w-4 h-4" /> {post.category}
                  </span>
                </div>
              )}

              {/* Tags cloud (if exists) */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* ── More Articles (bottom strip) ───────────────────────────────── */}
        {recentPosts.length > 0 && (
          <div className="container max-w-6xl mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border" />
              <h2 className="font-heading text-xl font-bold text-foreground whitespace-nowrap">You may also like</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 3).map(p => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-muted-foreground/20" />
                      </div>
                    )}
                    {p.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase rounded-full shadow-sm">
                          {p.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-foreground text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-2">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatShortDate(p.created_at)}</span>
                      {p.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.read_time}m</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
