"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Toaster } from "@/components/ui/sonner";
import { showToast } from "@/components/ui/custom-toast";
// import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
// import setCookieParser from "set-cookie-parser";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  // const { login } = useAuth();
  const onSubmit = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // 👈 this is the key
      });

      if (response.status === 200) {
        showToast({
          title: "Login Successful",
          description: "You have successfully logged in",
          type: "success",
        });
        console.log("Response in header", response.headers);
        // const cookieStore = await cookies();

        // const cookieData = setCookieParser(response.headers.getSetCookie()!);

        // cookieData.forEach((cookie) =>
        //   //eslint
        //   //@ts-ignore
        //   cookieStore.set(cookie.name, cookie.value, { ...cookie })
        // );

        const { accessToken, role } = await response.json();
        // login({ accessToken });
        Cookies.set("accessToken", accessToken);
        reset();
        setTimeout(() => {
          if (role === "SUPER_ADMIN") {
            router.push("/super-admin/select-tenant");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        showToast({
          title: "Login Failed",
          description: "Invalid email or password",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setTimeout(() => setIsSubmitting(false), 2000); // Re-enable button after 2 seconds
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-md text-balance my-2">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?
        <br />
        Please contact{" "}
        <span className="font-medium underline text-lg text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
          Lumica Labs Pvt. Ltd
        </span>
      </div>
      <Toaster />
    </form>
  );
}
