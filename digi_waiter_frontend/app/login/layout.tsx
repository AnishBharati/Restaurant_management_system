"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken") || null;
    setAccessToken(token);
    setLoading(false);

    if (token) {
      // show loader first, then redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 500); // optional delay for UX
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <CircularProgress />
      </div>
    );
  }

  if (accessToken) {
    // Still show loader while redirecting
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <CircularProgress />
      </div>
    );
  }

  // No token → show login page
  return <>{children}</>;
}
