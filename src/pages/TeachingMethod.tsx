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
    title: "THINGS for our students and what we do",
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
        <main className="pb-20">
          <section className="pt-40 pb-24 bg-[#A11B5A] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                Teaching Method
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                {pageData.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                Our pedagogical approach is designed to inspire curiosity and foster holistic development in every child.
              </p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
            </div>
          </section>

          <section className="relative py-20 px-4 overflow-hidden bg-white">
            <div className="container mx-auto relative max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 relative">
              
                {/* Left Cards */}
                <div className="flex flex-col gap-8 lg:gap-32 w-full lg:w-1/3 z-20">
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform lg:-translate-x-12">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{pageCards[0].title}</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {pageCards[0].content}
                    </p>
                    {pageCards[0].link_text && (
                      <a href={pageCards[0].link_url || "#"} className="inline-flex items-center text-blue-600 font-bold hover:underline gap-1">
                        {pageCards[0].link_text} <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 transform lg:-translate-x-12">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{pageCards[1].title}</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {pageCards[1].content}
                    </p>
                    {pageCards[1].link_text && (
                      <a href={pageCards[1].link_url || "#"} className="inline-flex items-center text-blue-600 font-bold hover:underline gap-1">
                        {pageCards[1].link_text} <ExternalLink size={16} />
                      </a>
                    )}
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
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {pageCards[3].content}
                    </p>
                    {pageCards[3].link_text && (
                      <a href={pageCards[3].link_url || "#"} className="inline-flex items-center text-blue-600 font-bold hover:underline gap-1">
                        {pageCards[3].link_text} <ExternalLink size={16} />
                      </a>
                    )}
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

