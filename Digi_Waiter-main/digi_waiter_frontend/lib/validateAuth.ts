import { cookies } from "next/headers";
import axios from "axios";
import { api } from "./axios";
export const validateAuth = async () => {
  console.log("validating");
  try {
    const cookieStore = await cookies(); // call the function
    const refreshToken = cookieStore.get("refreshToken")?.value; // get the value
    // const url = process.env.NEXT_PUBLIC_API_URL;

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const res = await api.post(`/api/auth/refresh-token`, {
      refreshToken,
    });

    const data = await res.data;
    console.log("Response from validate: ", data);

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};
