import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Curriculum() {
  const preschoolActivities = [
    "Sorting, matching, pretend play, and science experiments contributing to cognitive and social development.",
    "Gross motor activities enhancing physical fitness and coordination.",
    "Special days and field trips introducing children to colors, fruits, animals, and the environment."
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400"
  ];

  return (
    <div className="min-h-screen font-sans bg-white">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb / Title */}
          <div className="text-center mb-12">
            <p className="text-gray-600 font-medium mb-2">Curriculum</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">DBA's Education Pathway</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-12">
              {/* Main Image & Decorative Elements */}
              <div className="relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10]">
                  <img 
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200" 
                    alt="Students in classroom" 
                    className="w-full h-full object-cover"
                  />
                  {/* Decorative Maroon Box */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#A11B5A] -mr-6 -mb-6 rounded-3xl -z-10 hidden md:block"></div>
                  {/* Decorative floating square outline */}
                  <div className="absolute top-1/2 -left-12 w-16 h-16 border-4 border-yellow-400 rounded-2xl rotate-12 -z-10 hidden md:block"></div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                  {galleryImages.map((src, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden shadow-md aspect-video">
                      <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Preschool Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">Fun and Educational Preschool Activities</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Preschool activities aim to foster learning, creativity, and development in children aged 3-5. These activities encompass arts and crafts, storytelling, music, sensory play, outdoor play and many many more like:
                </p>
                <ul className="space-y-4">
                  {preschoolActivities.map((activity, idx) => (
                    <li key={idx} className="flex gap-4 items-start group">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900">
                        <Check size={14} strokeWidth={4} />
                      </div>
                      <span className="text-gray-700 font-medium leading-tight group-hover:text-gray-900 transition-colors">
                        {activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strongroots Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 uppercase">STRONGROOTS PROGRAM (Primary And Secondary)</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Doon Blossom Academy, Ahmedabad, known for holistic student development is affiliated to CBSE Board. We have a special foundation curriculum for grades VII & VIII focusing on essential topics. We aim to ensure a smooth transition and strong foundation for future studies with the STRONGROOTS program.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  A Holistic Educational Framework in Accordance with NEP 2020 Principles -
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg italic">
                  The educational framework at Doon Blossom Academy aligns with the National Education Policy (NEP) 2020, emphasizing trust, autonomy, and flexibility. It prioritizes child-centered learning in preschool and primary education. The focus is on nurturing talents, curiosity, and real-world exposure, while also providing free guidance for national-level exams and reducing financial burdens.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  The system aims to cultivate student's interest, promote equal opportunities, diverse teaching techniques, collaboration, and essential skill development in a respectful learning environment. Competencies developed include self-direction, problem-solving, effective communication and Sanskar building for holistic development.
                </p>
              </div>

              {/* Admission Card */}
              <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 sticky top-32">
                <div className="bg-[#A11B5A] py-6 text-center">
                  <h3 className="text-2xl font-black text-white">Admission Open</h3>
                </div>
                <div className="p-10 text-center space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-gray-900">Register Your Child</h4>
                    <p className="text-gray-500 font-medium">Admission Open for new batches</p>
                  </div>
                  <div className="text-5xl font-black text-gray-900 tracking-tight py-4">
                    2026-27
                  </div>
                  <Button 
                    className="w-full py-8 text-xl font-black bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-2xl shadow-lg shadow-yellow-200 transition-all active:scale-95"
                    onClick={() => window.location.href = '/admissions'}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
