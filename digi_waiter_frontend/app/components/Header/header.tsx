import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/context/AuthContext";
const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 md:hidden" />
      {/* <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          /> */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block text-gray-800 hover:text-black text-md md:text-lg">
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {/* <BreadcrumbSeparator className="hidden md:block" /> */}
          {/* <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-1 items-center justify-end gap-4">
        <button className="my-account-btn border-2 border-gray-300 rounded-full py-3 px-3 hover:bg-gray-100 cursor-pointer">
          User{" "}
        </button>
      </div>
    </header>
  );
};

export default Header;
