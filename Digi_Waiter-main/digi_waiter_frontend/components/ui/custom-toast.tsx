"use client";

import React, { JSX } from "react";
import { toast } from "sonner";
import { TiTickOutline } from "react-icons/ti";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineWarning } from "react-icons/ai";
import { IoInformationCircleOutline } from "react-icons/io5";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
}

const icons: Record<ToastType, JSX.Element> = {
  success: <TiTickOutline className="text-green-600 text-2xl" />,
  error: <MdErrorOutline className="text-red-600 text-2xl" />,
  warning: <AiOutlineWarning className="text-yellow-600 text-2xl" />,
  info: <IoInformationCircleOutline className="text-blue-600 text-2xl" />,
};

const containerColors: Record<ToastType, string> = {
  success: "bg-green-100 border-green-400",
  error: "bg-red-100 border-red-400",
  warning: "bg-yellow-100 border-yellow-400",
  info: "bg-blue-100 border-blue-400",
};

const titleColors: Record<ToastType, string> = {
  success: "text-green-800",
  error: "text-red-800",
  warning: "text-yellow-800",
  info: "text-blue-800",
};

const descriptionColors: Record<ToastType, string> = {
  success: "text-green-700",
  error: "text-red-700",
  warning: "text-yellow-700",
  info: "text-blue-700",
};

export function showToast({ title, description, type = "info" }: ToastOptions) {
  toast(
    <div className="flex items-start gap-3">
      {icons[type]}
      <div>
        <div className={`text-base font-semibold ${titleColors[type]}`}>
          {title}
        </div>
        {description && (
          <div className={`text-sm ${descriptionColors[type]}`}>
            {description}
          </div>
        )}
      </div>
    </div>,
    {
      unstyled: true,
      duration: 4000,
      className: `flex items-center gap-3 border shadow-md rounded-xl px-4 py-3 w-full max-w-sm ${containerColors[type]}`,
    }
  );
}
