import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Loader2, Table as TableIcon, Info } from "lucide-react";

export default function FeesStructure() {
  const { data: fees = [], isLoading } = useQuery({
    queryKey: ["public-fees-structure"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fees_structure").select("*").order("grade");
      if (error) throw error;
      return data;
    },
  });

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
              Admissions
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Fees Structure
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Transparent and affordable education for a bright future.
            </p>
          </div>
        </section>

        {/* Fees Table */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  <TableIcon className="w-4 h-4" />
                  Academic Year 2026-27
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground">School Fees by Grade</h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : fees.length > 0 ? (
                <div className="bg-card rounded-2xl border border-border shadow-strong overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="px-6 py-4 font-semibold">Grade / Class</th>
                          <th className="px-6 py-4 font-semibold">Admission Fee</th>
                          <th className="px-6 py-4 font-semibold">Tuition Fee</th>
                          <th className="px-6 py-4 font-semibold text-right">Total Annual Fee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {fees.map((fee: any) => (
                          <tr key={fee.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 font-medium text-foreground">{fee.grade}</td>
                            <td className="px-6 py-4 text-muted-foreground">{fee.admission_fee || "-"}</td>
                            <td className="px-6 py-4 text-muted-foreground">{fee.tuition_fee || "-"}</td>
                            <td className="px-6 py-4 font-bold text-primary text-right">{fee.total || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground">Fees structure details are currently being updated. Please contact the school office for more information.</p>
                </div>
              )}

              <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start">
                <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-bold mb-1">Important Note:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Fees are subject to change as per the school management's decision.</li>
                    <li>Transport, uniform, and books are not included in the above tuition fees.</li>
                    <li>Fees once paid are non-refundable and non-transferable.</li>
                  </ul>
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
