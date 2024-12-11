"use client";
import {
  File,
  History,
  Home,
  Inbox,
  Settings,
  Sparkle,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";

export function AppSidebar() {
  const { user } = useUser();

  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Resume",
      url: "/resumes",
      icon: File,
    },
    {
      title: "Interviews",
      url: "#",
      icon: History,
    },
    {
      title: "Profile",
      url: `/profile/${user?.fullName}`,
      icon: User,
    },
    {
      title: "Upgrade Plan",
      url: "#",
      icon: Sparkle,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl mt-5 ml-2">
            Menubar
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="ml-2 mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="text-xl">
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

      <SidebarFooter className="pb-8">
        <div className="flex justify-around">
          <UserButton /> {user?.fullName}{" "}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
