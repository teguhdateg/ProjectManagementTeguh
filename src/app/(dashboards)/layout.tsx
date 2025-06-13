import { SidebarFooter, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import FooterBar from "@/components/FooterBar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const cookieStore = await cookies()
   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex flex-col w-full min-h-screen overflow-x-hidden">
              <Navbar/>
              <div className="p-9">
              {children}
              </div>
              <FooterBar/>
            </main>
          </SidebarProvider>
  );
}
