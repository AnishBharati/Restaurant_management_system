import React from "react";
import SelectTenant from "./SelectTenant";
import Image from "next/image";
import { api } from "@/lib/axios";
// import Cookies from "js-cookie";
import { cookies } from "next/headers";
const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken");
  console.log("Refresh token when api in company hit: ", refreshToken);
  const res = await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/get-company`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // If needed
      },
    }
  );
  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-white px-4">
      <div className="text-center mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto mb-4 border-2 border-gray-200 rounded-full p-3 shadow-sm bg-black text-white"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Lumica Labs Pvt. Ltd.
        </h1>
        <p className="text-md md:text-base text-gray-600 mt-2">
          Manage and switch between your tenants.
        </p>
      </div>

      <SelectTenant />
    </div>
  );
};

export default page;
