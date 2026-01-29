import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Gift, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  discount: string | null;
}

export function AladdinLamp() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewOffers, setHasNewOffers] = useState(false);

  const { data: offers = [] } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Offer[];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("lamp_color")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const lampColor = settings?.lamp_color || "#4C0DC9";

  useEffect(() => {
    if (offers.length > 0) {
      setHasNewOffers(true);
    }
  }, [offers]);

  if (offers.length === 0) return null;

  return (
    <>
      {/* Hanging Lamp */}
      <div className="fixed left-4 md:left-8 top-0 z-[100] pointer-events-none">
        {/* The String */}
        <div 
          className="w-px h-24 md:h-32 mx-auto" 
          style={{ backgroundColor: `${lampColor}4D` }} // 30% opacity
        />
        
        {/* The Lamp Container */}
        <motion.div
          className="pointer-events-auto cursor-pointer relative"
          initial={{ rotate: -5 }}
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            setIsOpen(true);
            setHasNewOffers(false);
          }}
        >
          {/* Notification Dot */}
          {hasNewOffers && (
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full z-10 border-2 border-background"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Aladdin Lamp SVG */}
          <div className="relative group">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: lampColor }}
              className="drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] group-hover:scale-110 transition-transform duration-300"
            >
              <path
                d="M21 13C21 16.866 17.866 20 14 20C10.134 20 7 16.866 7 13C7 10.7909 8.79086 9 11 9H14C17.866 9 21 12.134 21 13Z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 13H3C2.44772 13 2 12.5523 2 12V11C2 10.4477 2.44772 10 3 10H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M14 9V7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11 20L11 22M14 20L14 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M18 13C18 13 19 11 21 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="14" cy="13" r="1" fill="currentColor" />
            </svg>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-xl text-xs font-medium text-foreground">
                Psst! Open for magic offers ✨
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Offers Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full -ml-16 -mb-16 blur-3xl" />

              <div className="p-8 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-heading">Exclusive Offers</h2>
                    <p className="text-sm text-muted-foreground">Magic deals just for you! ✨</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {offers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 rounded-2xl bg-secondary/50 border border-border group hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-foreground text-lg">{offer.title}</h3>
                        {offer.discount && (
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            {offer.discount}
                          </span>
                        )}
                      </div>
                      
                      {offer.description && (
                        <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
                      )}

                      {offer.code && (
                        <div className="flex items-center justify-between p-3 bg-card border border-dashed border-primary/30 rounded-xl group-hover:bg-primary/5 transition-colors">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            <span className="text-sm font-mono font-bold text-primary uppercase tracking-wider">{offer.code}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-xs font-bold hover:text-primary"
                            onClick={() => {
                              navigator.clipboard.writeText(offer.code!);
                              alert("Promo code copied to clipboard!");
                            }}
                          >
                            Copy Code
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button className="w-full rounded-xl h-12 font-bold" onClick={() => setIsOpen(false)}>
                    Close Box
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
