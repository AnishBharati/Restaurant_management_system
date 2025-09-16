"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function SelectTenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuperUser, setIsSuperUser] = useState<Boolean>(true);
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();
  // const checkUser = "SUPER_USER";

  useEffect(() => {
    setLoading(false);

    if (!isSuperUser) {
      setTimeout(() => {
        router.push("/dashboard");
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

  if (!isSuperUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-300">
        <CircularProgress />
      </div>
    );
  }
  return <>{children}</>;
}
