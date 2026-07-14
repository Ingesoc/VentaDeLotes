import { Outlet } from "react-router-dom";
import { TopNavBar } from "./TopNavBar";
import { Footer } from "./Footer";
import { BottomNavBar } from "./BottomNavBar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function RootLayout() {
  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-1">
        {/* Aquí se renderiza la página actual basada en la ruta */}
        <Outlet />
      </main>
      <Footer />
      <BottomNavBar />
      <WhatsAppButton />
    </div>
  );
}
