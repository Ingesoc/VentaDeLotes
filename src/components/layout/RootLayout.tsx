import { Outlet } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { TopNavBar } from "./TopNavBar";
import { Footer } from "./Footer";
import { BottomNavBar } from "./BottomNavBar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollToTop } from "./ScrollToTop";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

export function RootLayout() {
  return (
    <HelmetProvider>
    <LocalBusinessSchema />
    <div className="bg-background text-on-background font-body-md antialiased min-h-dvh flex flex-col">
      <ScrollToTop />
      <TopNavBar />
      <main className="flex-1">
        {/* Página actual según la ruta */}
        <Outlet />
      </main>
      <Footer />
      <BottomNavBar />
      <WhatsAppButton />
    </div>
    </HelmetProvider>
  );
}
