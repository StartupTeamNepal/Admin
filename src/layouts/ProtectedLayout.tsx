import { Outlet, useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/Sidebar"
import { DashboardHeader } from "@/components/DashboardHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function ProtectedLayout() {
  const navigate = useNavigate()
  
  // Mock user data - replace with your auth context hook
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg"
  }

  const handleGlobalLogout = () => {
    // Perform any global state cleanup here (e.g., Redux, Context)
    console.log("Global state cleared")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative isolate flex flex-col flex-1 min-w-0 min-h-screen overflow-x-hidden bg-background [transform:translate(0,0)]">
        <DashboardHeader 
          user={user} 
          onLogout={handleGlobalLogout}
        />
            <main
              id="dialog-root"
              className="relative flex-1 p-4 md:p-6 lg:p-8 w-full mx-auto"
            >          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}