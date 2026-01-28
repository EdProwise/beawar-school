import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Results() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container">
          <h1 className="text-4xl font-bold mb-6">Results</h1>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
