"use client";
import { GalleryVerticalEnd } from "lucide-react";
import themePhoto from "@/public/themephoto1.jpg";
import { LoginForm } from "../components/Forms/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={themePhoto}
          alt="Theme Photo"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Lumica Labs Pvt. Ltd
          </a>
        </div>
        <div className="flex items-center justify-center">
          <h1 className="md:text-5xl text-2xl font-bold">Digiwaiter Login</h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md md:border-2 md:border-gray-200 md:py-16 md:px-6 md:rounded-lg md:shadow-lg">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
