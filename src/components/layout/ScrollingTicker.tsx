import { motion } from "framer-motion";
import { useScrollWords } from "@/hooks/use-school-data";
import { Sparkles, Star } from "lucide-react";

export function ScrollingTicker() {
  const { data: words = [] } = useScrollWords();

  if (words.length === 0) return null;

  // Duplicate words to ensure seamless infinite scroll
  // We'll repeat it enough times to fill the width and allow for long animations
  const scrollingItems = Array(10).fill(words).flat();

  return (
    <div className="bg-primary/95 backdrop-blur-md border-y border-primary-light/30 py-2.5 overflow-hidden whitespace-nowrap shadow-lg relative z-40">
      {/* Decorative gradients for edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary via-primary/80 to-transparent z-10" />
      
      <div className="flex items-center">
        <motion.div
          animate={{
            x: [-2000, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-12 px-8"
        >
          {scrollingItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-6 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors border border-white/5">
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
              </div>
              <span className="text-sm font-black text-primary-foreground uppercase tracking-[0.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {item.text}
              </span>
              <Sparkles className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
