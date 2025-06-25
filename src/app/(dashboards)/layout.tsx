import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import FooterBar from "@/components/FooterBar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <Navbar /> {/* Navbar di atas main */}
      <main className="flex flex-col w-screen min-h-screen bg-white">
        <div className="flex-1 p-9 pt-16 min-h-screen bg-white">{children}</div>
        <FooterBar />
      </main>
    </SidebarProvider>
  );
}
