"use client"
import * as React from "react"
import {
  IconArticle,
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
import { decodeJWT } from "@/types/jwt"

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
      title: "Article",
      icon: IconArticle
    },
    {
      id: 6,
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],

}

export function AppSidebar({ userSelect, ...props }: React.ComponentProps<typeof Sidebar> & { userSelect: (val: number) => void }) {
  const [nkp, setNkp] = React.useState<string | null>(null)

  const [isAdmin] = React.useState<boolean>(() => {
    const token = localStorage.getItem("token")
    return Boolean(decodeJWT(token)?.is_admin)
  })

  const visibleNavMain = React.useMemo(() => {
    if (isAdmin) return data.navMain

    return data.navMain
      .filter((item) => item.title === "Dashboard")
      .map((item) => ({
        ...item,
        items: item.items?.map((sub) =>
          sub.id === 1 ? { ...sub, title: "Profile" } : sub
        ),
      }))
  }, [isAdmin])

  React.useEffect(() => {
    setNkp(localStorage.getItem("nkp"))

    const handleStorage = () => setNkp(localStorage.getItem("nkp"))
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <img src="/Logo_ordo1.png" className="size-8!" />
                <span className="text-base font-semibold">OFMConv-Indo</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={visibleNavMain} userSelect={userSelect} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser nkp={nkp} user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}