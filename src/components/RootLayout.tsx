import { Outlet } from "react-router-dom";
import { RouteProgress } from "@/components/RouteProgress";

export function RootLayout() {
  return (
    <>
      <RouteProgress />
      <Outlet />
    </>
  );
}
