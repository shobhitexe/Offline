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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./index";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Layers,
  User,
  Sheet,
  Proportions,
  Store,
  Spade,
  List,
  SquareChartGantt,
  FolderCog,
  Trophy,
  Settings,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

const items = [
  {
    title: "Dashboard",
    icon: Gauge,
    url: "/dashboard",
  },
  {
    title: "User List",
    icon: User,
    url: "/list",
  },
  {
    title: "Risk Analysis",
    icon: Layers,
    url: "/risk-analysis/in-play",
  },
  {
    title: "Balance Sheet",
    icon: Sheet,
    url: "/balance-sheet",
  },
  {
    title: "Reports",
    icon: Proportions,
    url: "/reports",
  },
  {
    title: "Open Market",
    icon: Store,
    url: "/open-market",
  },
  {
    title: "Casino",
    icon: Spade,
    url: "/reports",
  },
  {
    title: "Tournament List",
    icon: List,
    url: "/tournament-list/view?game=cricket",
    base: "/tournament-list",
  },
  {
    title: "Events",
    icon: SquareChartGantt,
    url: "/events/add-event?game=cricket",
    base: "/events/add-event",
  },
  {
    title: "Match Settings",
    icon: FolderCog,
    url: "/reports",
    childrens: [
      {
        title: "Session",
        url: "/match-settings/session",
        base: "/match-settings/session",
      },
      {
        title: "Match",
        url: "/match-settings/result-market",
        base: "/match-settings/result-market",
      },
      {
        title: "Session History",
        url: "/match-settings/session-history",
        base: "/match-settings/session-history",
      },
      {
        title: "Match History",
        url: "/match-settings/match-history",
        base: "/match-settings/match-history",
      },
    ],
  },
  {
    title: "Sports Settings",
    icon: Trophy,
    url: "/sports-settings",
  },
  {
    title: "General Settings",
    icon: Settings,
    url: "/reports",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isLinkActive = (link: string, base: string) => {
    return (
      pathname === link || pathname.startsWith(link) || pathname.includes(base)
    );
  };

  return (
    <Sidebar className="mt-14">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item) => {
                if (item.childrens) {
                  return (
                    <Collapsible key={item.title}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild>
                            <div
                              className={`rounded-lg flex items-center cursor-pointer pl-4`}
                            >
                              <item.icon />
                              <span className="relative -bottom-px">
                                {item.title}
                              </span>
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.childrens.map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                {" "}
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={item.url}
                                    className={`${
                                      isLinkActive(item.url, item.base)
                                        ? "bg-black text-white shadow-md border font-medium"
                                        : "hover:bg-black/10"
                                    } p-4 rounded-lg flex items-center`}
                                  >
                                    <span className="relative -bottom-px">
                                      {item.title}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`${
                          isLinkActive(item.url, item.base || "none")
                            ? "bg-black text-white shadow-md border font-medium hover:bg-black hover:text-white"
                            : "hover:bg-black/10"
                        } p-4 rounded-lg flex items-center`}
                      >
                        <item.icon />
                        <span className="relative -bottom-px">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
