import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { X, ChevronLeft, ChevronRight, Play, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGalleryItems } from "@/hooks/use-school-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: categories = ["All"] } = useQuery({
    queryKey: ["gallery-categories-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("category")
        .eq("is_published", true)
        .order("category");
      if (error) return ["All"];
      const unique = Array.from(new Set(data.map((i) => i.category)));
      // Normalize to Title Case for display if needed, but keeping as is for consistency with Admin
      return ["All", ...unique];
    },
  });
  
  const { data: galleryItems = [], isLoading } = useGalleryItems(activeCategory);

  const openLightbox = (id: string) => setSelectedImage(id);
  const closeLightbox = () => setSelectedImage(null);
  
  const navigateLightbox = (direction: "prev" | "next") => {
    if (selectedImage === null || galleryItems.length === 0) return;
    const currentIndex = galleryItems.findIndex(item => item.id === selectedImage);
    const newIndex = direction === "next" 
      ? (currentIndex + 1) % galleryItems.length 
      : (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedImage(galleryItems[newIndex].id);
  };

  const selectedItem = galleryItems.find(item => item.id === selectedImage);

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
              Gallery
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Campus Life in Pictures
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Explore moments from our vibrant school community
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-background border-b border-border sticky top-16 z-30">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full font-medium text-sm transition-all",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-secondary rounded-xl animate-pulse" />
                ))}
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No images found in this category.</p>
              </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {galleryItems.map((item) => {
                    const itemIsVideo = item.media_type === "video" || isVideoUrl(item.image_url);
                    return (
                    <div
                      key={item.id}
                      onClick={() => openLightbox(item.id)}
                      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                    >
                      {itemIsVideo ? (
                        <>
                          <video
                            src={item.image_url}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white ml-1" fill="white" />
                            </div>
                          </div>
                          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          <p className="text-primary-foreground font-semibold">{item.title}</p>
                          <p className="text-primary-foreground/70 text-sm capitalize">{item.category}</p>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
          {selectedImage !== null && selectedItem && (
            <div className="fixed inset-0 z-50 bg-primary-dark/95 flex items-center justify-center p-4">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateLightbox("prev")}
                className="absolute left-4 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateLightbox("next")}
                className="absolute right-4 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="max-w-4xl w-full">
                {(selectedItem.media_type === "video" || isVideoUrl(selectedItem.image_url)) ? (
                  <video
                    key={selectedItem.id}
                    src={selectedItem.image_url}
                    className="w-full rounded-xl"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full rounded-xl"
                  />
                )}
                <div className="text-center mt-4">
                  <p className="text-primary-foreground font-semibold text-lg">{selectedItem.title}</p>
                  <p className="text-primary-foreground/70 capitalize">{selectedItem.category}</p>
                </div>
              </div>
            </div>
          )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
