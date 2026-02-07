import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, GraduationCap, Quote } from "lucide-react";
import { FormattedContent } from "@/components/ui/formatted-content";
import { cn } from "@/lib/utils";

interface AlumniProfile {
  id: string;
  name: string;
  batch: string;
  image: string;
  designation: string;
  company?: string;
  location?: string;
  bio: string;
  is_featured: boolean;
}

interface AlumniCardProps {
  profile: AlumniProfile;
  variant?: "featured" | "standard";
  index?: number;
}

export function AlumniCard({ profile, variant = "standard", index = 0 }: AlumniCardProps) {
  const isFeatured = variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        isFeatured 
          ? "bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100" 
          : "bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100"
      )}
    >
      {/* Premium Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-5 transition duration-1000 group-hover:duration-200" />

      {isFeatured ? (
        <div className="flex flex-col h-full">
          <div className="aspect-[16/10] relative overflow-hidden rounded-t-[2.5rem]">
            <img 
              src={profile.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"} 
              alt={profile.name}
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            <div className="absolute top-6 right-6">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-semibold tracking-wide flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Class of {profile.batch}
              </div>
            </div>

            <div className="absolute bottom-6 left-8 right-8 text-white">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: (index * 0.1) + 0.3 }}
              >
                <h3 className="text-3xl font-bold mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">{profile.name}</h3>
                <div className="flex items-center gap-2 text-indigo-200 font-medium">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.designation} {profile.company && `at ${profile.company}`}</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="p-10 flex-1 flex flex-col">
            <div className="relative mb-6">
              <Quote className="absolute -top-4 -left-6 w-12 h-12 text-indigo-500/10" />
              <div className="relative z-10">
                <FormattedContent 
                  content={profile.bio} 
                  className="text-slate-600 italic text-lg leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500" 
                />
              </div>
            </div>
            
            {profile.location && (
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-slate-200 ring-4 ring-indigo-50/50 group-hover:ring-indigo-100 transition-all duration-500">
                {profile.image ? (
                  <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-400">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">{profile.name}</h4>
              <p className="text-sm font-medium text-indigo-600/80 mb-1">Class of {profile.batch}</p>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <Briefcase className="w-3 h-3" />
                {profile.designation}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-px bg-gradient-to-r from-slate-100 via-slate-100 to-transparent" />
            
            <div className="relative">
              <FormattedContent 
                content={profile.bio} 
                className="text-sm text-slate-500 line-clamp-3 group-hover:line-clamp-none transition-all duration-500 leading-relaxed" 
              />
            </div>

            {profile.location && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <MapPin className="w-3 h-3" />
                {profile.location}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
