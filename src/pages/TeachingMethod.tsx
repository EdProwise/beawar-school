import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExternalLink, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";

export default function TeachingMethod() {
  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["teaching-method-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_method_content").select("*").maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["teaching-method-cards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_method_cards").select("*").order("position", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (contentLoading || cardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultContent = {
    title: "What we do?",
    center_image: "https://images.unsplash.com/photo-1580894732444-8ecdead79730?auto=format&fit=crop&q=80&w=800"
  };

  const pageData = content || defaultContent;

  const defaultCards = [
    { title: 'Teaching with Passion', content: 'Our instructors inspire from the heart, going beyond textbooks.' },
    { title: 'Tech-Enhanced Classrooms', content: 'Our digital facilities create an engaging learning environment.' },
    { title: 'Interactive Clubs', content: 'Students form groups to foster curiosity and hands-on experiences.', link_text: 'Skill Development Clubs', link_url: '/extracurricular' },
    { title: 'Love-Centric Learning', content: 'We cultivate love for knowledge, making learning a joyous journey.' }
  ];

  const pageCards = cards && cards.length === 4 ? cards : defaultCards;

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="pt-20">
        <section className="relative py-20 px-4 overflow-hidden bg-[#E0F7F6]">
          {/* Decorative Wavy Background - Top */}
          <div className="absolute top-0 left-0 w-full h-32 bg-white" style={{ clipPath: 'ellipse(100% 50% at 50% 0%)' }}></div>
          
          <div className="container mx-auto relative z-10 text-center mb-16">
            <h3 className="text-sm font-bold tracking-widest text-gray-800 uppercase mb-2">THINGS FOR OUR STUDENTS</h3>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{pageData.title}</h2>
            <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="container mx-auto relative max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 relative">
              
              {/* Left Cards */}
              <div className="flex flex-col gap-8 lg:gap-32 w-full lg:w-1/3 z-20">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform lg:-translate-x-12">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{pageCards[0].title}</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {pageCards[0].content}
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform lg:-translate-x-12">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{pageCards[1].title}</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {pageCards[1].content}
                  </p>
                </div>
              </div>

              {/* Center Image */}
              <div className="w-full lg:w-2/5 flex justify-center relative">
                <div className="relative w-full max-w-md aspect-[4/5] bg-slate-500 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img 
                    src={pageData.center_image} 
                    alt="Teacher" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>

              {/* Right Cards */}
              <div className="flex flex-col gap-8 lg:gap-32 w-full lg:w-1/3 z-20">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform lg:translate-x-12">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{pageCards[2].title}</h4>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {pageCards[2].content}
                  </p>
                  {pageCards[2].link_text && (
                    <a href={pageCards[2].link_url || "#"} className="inline-flex items-center text-blue-600 font-bold hover:underline gap-1">
                      {pageCards[2].link_text} <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform lg:translate-x-12">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{pageCards[3].title}</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {pageCards[3].content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

