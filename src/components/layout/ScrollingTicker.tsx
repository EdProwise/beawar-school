import { motion } from "framer-motion";
import { useScrollWords } from "@/hooks/use-school-data";
import { Sparkles } from "lucide-react";

export function ScrollingTicker() {
  const { data: words = [] } = useScrollWords();

  if (words.length === 0) return null;

  // Duplicate words to ensure seamless infinite scroll
  const scrollingItems = [...words, ...words, ...words];

  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2.5 overflow-hidden whitespace-nowrap backdrop-blur-sm">
      <div className="flex items-center">
        <motion.div
          animate={{
            x: [0, -1035], // Adjust based on content width
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-12 px-6"
        >
          {scrollingItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {item.text}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
