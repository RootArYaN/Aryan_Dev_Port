import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { BackgroundScene } from "@/components/visual/BackgroundScene";

export function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => document.getElementById("main-content")?.focus({ preventScroll: true }));
  }, [pathname]);

  return (
    <div className="min-h-screen overflow-clip">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <BackgroundScene />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
