"use client"

import * as React from "react"
import {
  Bell,
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  IndianRupee,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Ashwin Narayanan S",
    email: "cb.en.u4cse21008@students.amrita.edu",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Pragati 2025",
      logo: GalleryVerticalEnd,
      plan: "Organizing Team",
    },
  ],
  navMain: [
    {
      title: "Events",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "View Events",
          url: "#",
        },
        {
          title: "New Event",
          url: "#",
        },
      ],
    },
    {
      title: "Participants",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Event-Wise",
          url: "#",
        },
      ],
    },
    {
      title: "Announcements",
      url: "#",
      icon: Bell,
      items: [
        {
          title: "View Announcements",
          url: "#",
        },
        {
          title: "New Announcement",
          url: "#",
        },
      ],
    },
    {
      title: "Revenue",
      url: "#",
      icon: IndianRupee,
      items: [
        {
          title: "Monitor",
          url: "#",
        },
      ],
    },
    {
      title: "Tags",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "View Tags",
          url: "#",
        },
        {
          title: "New Tag",
          url: "#",
        },
      ],
    },
    {
      title: "Clubs",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "View Clubs",
          url: "#",
        },
        {
          title: "New Club",
          url: "#",
        },
        {
          title: "Club-Wise Events",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
