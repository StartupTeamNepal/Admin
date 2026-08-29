import { Home,Table,Box, icons,Group,Coins,FileText,Menu } from "lucide-react"
  
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

const items = [
  { title: "Home", url: "/", icon: Home },
  // {title:"",url:"",icon:}
    {title:"Tables",url:"/manage-table",icon:Table},
    {title:"Inventory",url:"/inventory",icon:Box},
    {title:"Staff",url:"/staff",icon:Group},
    {title:"Billing",url:"/billing",icon:Coins},
    {title:"Report",url:"/reports",icon:FileText},
    {title:"Menu",url:"/menu",icon:Menu}
 
 
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
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
    </Sidebar>
  )
}