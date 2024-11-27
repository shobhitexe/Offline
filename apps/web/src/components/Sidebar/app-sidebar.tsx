"use client";

import Link from "next/link";
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
} from "./index";
import { usePathname } from "next/navigation";
import { Gauge, User, Users } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    icon: Gauge,
    url: "/dashboard",
  },
  {
    title: "User List",
    icon: User,
    url: "/user-list",
  },
  {
    title: "Agents List",
    icon: Users,
    url: "/agent-list",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isLinkActive = (link: string) => {
    return pathname === link || pathname.startsWith(link);
  };

  return (
    <Sidebar className="sm:mt-20 mt-10">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${isLinkActive(item.url) ? "bg-white shadow hover:bg-white" : "bg-transparent"} p-5`}
                    >
                      <item.icon />
                      <span className="text-black">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
