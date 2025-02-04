import { Bell, BookOpen, Bot, IndianRupee, Settings2, SquareTerminal } from "lucide-react";

const navItems = [
    {
      title: "Events",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "View Events",
          url: "#",
          isActive: true,
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
]

export function generateNavItems(
    activeItem: string,
    activeSubItem: string
) {
    return navItems.map((item) => {
        const isActive = item.title === activeItem;
        return {
            ...item,
            isActive,
            items: item.items?.map((subItem) => ({
                ...subItem,
                isActive: subItem.title === activeSubItem,
            })),
        };
    });
}
