"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { AppSidebar } from "../components/Sidebar/app-sidebar";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Header from "../components/Header/header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/select-tenant" || pathname === "/add-company";
  useEffect(() => {
    // Access Cookies only on client
    const token = Cookies.get("accessToken") || null;
    setAccessToken(token);
    setLoading(false);

    if (!token) {
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <CircularProgress />
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {!hideNavbar ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      ) : (
        children
      )}
    </>
  );
}
