import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { SearchForm } from "../../components/Forms/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Sample data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [],
    },
    {
      title: "Tables",
      url: "#",
      items: [
        {
          title: "All Tables",
          url: "#",
        },
        {
          title: "Table History",
          url: "#",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      items: [],
    },
    {
      title: "Menu",
      url: "#",
      items: [],
    },
    {
      title: "App",
      url: "#",
      items: [
        {
          title: "Download APK",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {
          title: "Table Configuration",
          url: "#",
        },
        {
          title: "Order Management",
          url: "#",
        },
        {
          title: "Staff Management",
          url: "#",
        },
        {
          title: "Menu Configuration",
          url: "#",
        },
        {
          title: "Sales Tracking",
          url: "#",
        },
      ],
    },
    {
      title: "Restaurant",
      url: "#",
      items: [
        {
          title: "Restaurant Information",
          url: "#",
        },
      ],
    },
    {
      title: "Share",
      url: "#",
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  Image
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium text-md md:text-lg">
                    Tenant Name
                  </span>
                  <span className="">Description</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) =>
              item.items.length > 0 ? (
                // Has sub-items → Collapsible
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 0}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              // isActive={subItem.isActive}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // No sub-items → Direct link
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>{item.title}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
