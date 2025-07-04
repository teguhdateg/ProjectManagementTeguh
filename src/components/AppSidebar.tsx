"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  FileArchive,
  FileBadge2,
  FileCheck2,
  Home,
  Settings,
  ShieldEllipsis,
  User2,
} from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FileBadge2,
  },
  {
    title: "Task",
    url: "/task",
    icon: FileArchive,
  },
  {
    title: "User",
    url: "/user",
    icon: User2,
  },
];
export default function AppSidebar() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const logoSrc = !mounted
  //   ? "https://credit-admin-dev.pinjammodal.id/static/media/logo.2c80faded8ad9c4133da2a1cde993ec3.svg" // fallback logo saat SSR
  //   : theme === "light"
  //     ? "https://credit-admin-dev.pinjammodal.id/static/media/logo.2c80faded8ad9c4133da2a1cde993ec3.svg"
  //     : "https://b2b-partnership-dev.pinjammodal.id/static/media/logo-white.08c9b1aa80f2d149208efe4dc8f545a3.svg";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"}>
              {/* <img src={logoSrc} alt="logo" className="h-12" /> */}
              <h2 className="w-full item-center justify-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-cyan-600 to-blue-900 bg-">
                My Projects
              </h2>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Credit Officer
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
