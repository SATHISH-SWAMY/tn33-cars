import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Link } from "react-router"


const items = [

  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Inbox,
  },
  {
    title: "Add Cars",
    url: "/admin/AddCars",
    icon: Inbox,
  },
  {
    title: "FormsCollection",
    url: "/admin/FormsCollection",
    icon: Calendar,
  },
  {
    title1: "client side",
    url: "/",
    icon: Calendar,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item,index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                     <item.icon />
                      <span>{item.title}</span>
                      <button>{item.title1}</button>
                    </Link>
               
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}