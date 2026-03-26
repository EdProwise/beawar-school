import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBlogPosts, useBlogSettings, useSiteSettings } from "@/hooks/use-school-data";
import { FormattedContent } from "@/components/ui/formatted-content";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";
import {
  Loader2, Search, Calendar, Clock, Tag, User, ArrowRight,
  BookOpen, Star, PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cardAccents = [
  "from-primary to-primary-dark",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return new DOMParser().parseFromString(html, "text/html").body.textContent || "";
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: blogSettings } = useBlogSettings();
  const { data: siteSettings } = useSiteSettings();

  const schoolName = siteSettings?.school_name || "";
  const siteUrl = siteSettings?.site_url || "";

  const heading = blogSettings?.page_heading || "Our Blog";
  const subheading = blogSettings?.page_subheading || "Insights, stories, and updates from our school community.";
  const cardStyle = blogSettings?.card_style || "modern";
  const showAuthor = blogSettings?.show_author ?? true;
  const showDate = blogSettings?.show_date ?? true;
  const showReadTime = blogSettings?.show_read_time ?? true;
  const showTags = blogSettings?.show_tags ?? true;
  const postsPerPage = blogSettings?.posts_per_page || 9;

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))];

  const filtered = posts.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      stripHtml(p.excerpt).toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  }).slice(0, postsPerPage);

  const featured = !search && activeCategory === "All" ? posts.find(p => p.is_featured) : null;
  const grid = featured ? filtered.filter(p => p.id !== featured.id) : filtered;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <SEOHead
        title={`Blog | ${schoolName}`}
        description={subheading}
        keywords={`${schoolName} blog, school articles`}
        canonicalPath="/blog"
        jsonLd={buildBreadcrumbSchema(siteUrl, [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-3xl -z-10" />

          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 border border-gray-100 rounded-full shadow-sm mb-6 backdrop-blur-sm">
              <PenLine className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">School Blog</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-5 leading-tight">
              {heading}
            </h1>
            <p className="text-black/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">{subheading}</p>

            {/* Search + filter */}
            <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/35" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-black placeholder:text-black/30 text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {categories.length > 1 && (
                <>
                  <div className="hidden md:block w-px h-10 bg-gray-100 self-center" />
                  <div className="flex items-center gap-1.5 px-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                          activeCategory === cat
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-black/55 hover:bg-gray-100"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured && (
          <section className="pb-14">
            <div className="container">
              <Link
                to={`/blog/${featured.slug}`}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-black/5 flex flex-col lg:flex-row transition-all duration-500 hover:shadow-primary/8 block"
              >
                <div className="lg:w-[420px] shrink-0 relative overflow-hidden h-64 lg:h-auto">
                  {featured.cover_image_url ? (
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary text-xs font-black rounded-full shadow flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-primary" /> FEATURED
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {featured.category && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {featured.category}
                      </span>
                    )}
                    {showDate && (
                      <span className="flex items-center gap-1.5 text-black/40 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(featured.created_at)}
                      </span>
                    )}
                    {showReadTime && featured.read_time && (
                      <span className="flex items-center gap-1.5 text-black/40 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" /> {featured.read_time} min read
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-2xl lg:text-4xl font-bold text-black mb-4 leading-tight group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-black/55 text-base lg:text-lg mb-7 line-clamp-3 leading-relaxed">
                    {stripHtml(featured.excerpt) || stripHtml(featured.content)}
                  </p>
                  {showAuthor && featured.author_name && (
                    <div className="flex items-center gap-3 mb-7">
                      {featured.author_avatar ? (
                        <img src={featured.author_avatar} alt={featured.author_name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-black/70">{featured.author_name}</span>
                    </div>
                  )}
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm w-fit group-hover:bg-primary transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="pb-32">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : grid.length > 0 ? (
              <div className={cn(
                "grid gap-8",
                cardStyle === "minimal" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
              )}>
                {grid.map((post, idx) => {
                  const accent = cardAccents[idx % cardAccents.length];
                  return (
                    <article
                      key={post.id}
                      className={cn(
                        "group bg-white overflow-hidden border border-gray-100 transition-all duration-500 flex flex-col h-full shadow-sm",
                        cardStyle === "minimal"
                          ? "rounded-2xl hover:shadow-md"
                          : "rounded-[2rem] hover:border-primary/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
                      )}
                    >
                      {/* Cover */}
                      <div className={cn("relative overflow-hidden", cardStyle === "minimal" ? "aspect-[16/9]" : "aspect-[16/10]")}>
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${accent} flex items-center justify-center opacity-20`}>
                            <BookOpen className="w-16 h-16 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase rounded-full shadow-sm">
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-black/40 font-semibold uppercase tracking-widest mb-3">
                          {showDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>}
                          {showReadTime && post.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}m</span>}
                        </div>
                        <h3 className="font-heading text-lg font-bold text-black mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-black/55 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                          {stripHtml(post.excerpt) || stripHtml(post.content)}
                        </p>

                        {showTags && post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-black/50 rounded-lg text-[10px] font-semibold">
                                <Tag className="w-2.5 h-2.5" /> {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                          {showAuthor && post.author_name ? (
                            <div className="flex items-center gap-2">
                              {post.author_avatar ? (
                                <img src={post.author_avatar} alt={post.author_name} className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-3 h-3 text-primary" />
                                </div>
                              )}
                              <span className="text-xs font-semibold text-black/60">{post.author_name}</span>
                            </div>
                          ) : <span />}
                          <Link
                            to={`/blog/${post.slug}`}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent group/link`}
                          >
                            READ MORE <ArrowRight className="w-3.5 h-3.5 text-black/60 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">No posts found</h3>
                <p className="text-black/40">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
