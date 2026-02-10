import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routers } from "./router";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useSiteSettings } from "@/hooks/use-school-data";
import { DEFAULT_SCHOOL_NAME } from "@/config/defaults";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter(routers);

function DynamicHead() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const schoolName = settings?.school_name || DEFAULT_SCHOOL_NAME;
    document.title = schoolName;

    if (settings?.logo_url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.logo_url;
    }
  }, [settings]);

  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <DynamicHead />
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
};

export default App;
