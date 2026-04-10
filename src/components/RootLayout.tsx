import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { RouteProgress } from "@/components/RouteProgress";
import { useSiteSettings } from "@/hooks/use-school-data";

export function RootLayout() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const tagId = settings?.google_tag_id?.trim();

    // Remove any previously injected gtag scripts
    document.querySelectorAll("script[data-gtag]").forEach((el) => el.remove());

    if (!tagId) return;

    // Inject the gtag loader script
    const loaderScript = document.createElement("script");
    loaderScript.setAttribute("data-gtag", tagId);
    loaderScript.async = true;
    loaderScript.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
    document.head.appendChild(loaderScript);

    // Inject the gtag config script
    const configScript = document.createElement("script");
    configScript.setAttribute("data-gtag", tagId);
    configScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${tagId}');
    `;
    document.head.appendChild(configScript);
  }, [settings?.google_tag_id]);

  return (
    <>
      <RouteProgress />
      <Outlet />
    </>
  );
}
