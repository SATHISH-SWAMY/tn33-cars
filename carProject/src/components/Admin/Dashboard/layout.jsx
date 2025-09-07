import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Outlet } from "react-router"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main  className="flex-1 p-4 bg-gray-100">
        <SidebarTrigger />
        <Outlet/> 
      </main>
    </SidebarProvider>
  )
}