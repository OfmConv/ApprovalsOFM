"use client"
import * as React from "react"
import {
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { NavMain } from "@/utils/components/nav-main"
import { NavUser } from "@/utils/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const nkp = localStorage.getItem("nkp")
const data = {
  user: {
    name: "test",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconListDetails,
      items: [
        { title: "Card", id: 0 },
        { title: "Table", id: 1 }
      ],
    
    },
    {
      id: 2,
      title: "Approvals",
      url: "#",
      icon: IconReport,
    },
    {
      id: 3,
      title: "Create Account",
      url: "#",
      icon: IconUsers,
    },
    {
      id: 4,
      title: "Landing Page",
      icon: IconReport,
    },
    {
      id: 5,
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],

}

export function AppSidebar({ userSelect, ...props }: React.ComponentProps<typeof Sidebar> & {userSelect: (val: number) => void }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <img src="/Logo_ordo1.png" className="size-8!"/>
                <span className="text-base font-semibold">OFMConv-Indo</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} userSelect={userSelect} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser nkp={nkp} user={data.user} />
      </SidebarFooter>
      
    </Sidebar>
  )
}
