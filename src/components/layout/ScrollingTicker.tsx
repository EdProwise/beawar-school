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
    <div className="bg-primary border-y border-primary-light/20 py-2 overflow-hidden whitespace-nowrap shadow-inner relative">
      {/* Decorative gradients for edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-primary to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-primary to-transparent z-10" />
      
      <div className="flex items-center">
        <motion.div
          animate={{
            x: [0, -2000],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-16 px-8"
        >
          {scrollingItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-foreground/10">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <span className="text-sm font-bold text-primary-foreground uppercase tracking-[0.2em] drop-shadow-sm">
                {item.text}
              </span>
              <Sparkles className="w-4 h-4 text-primary-foreground/40" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
