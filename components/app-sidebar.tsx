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
const sample = {
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

export function AppSidebar({ user, ...props }: {
  user: {
    name: string
    email: string
    avatar: string
  }
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sample.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sample.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
