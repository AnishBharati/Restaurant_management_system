"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showToast } from "@/components/ui/custom-toast";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";

type FormValues = {
  companyName: string;
  address: string;
  phoneNumber: string;
  allowedDiscount: number;
  adminEmail: string;
  adminUsername: string;
  adminPassword: string;
  logo: FileList;
  description: string;
  role: string;
};

const AddCompanyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { role: "Admin" },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    showToast({
      title: "Company saved",
      description: `${data.companyName} has been added successfully`,
      type: "success",
    });
    // TODO: handle backend submission, handle logo with FormData
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Add New Company
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Info Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Company Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  {...register("companyName", {
                    required: "Company name is required",
                  })}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Address / Location</Label>
                <Input
                  id="address"
                  placeholder="Enter address"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+977 9800000000"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?\d{7,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="allowedDiscount">Allowed Discount (%)</Label>
                <Input
                  type="number"
                  id="allowedDiscount"
                  placeholder="10"
                  {...register("allowedDiscount", {
                    min: { value: 0, message: "Cannot be negative" },
                    max: { value: 100, message: "Cannot exceed 100" },
                  })}
                />
                {errors.allowedDiscount && (
                  <p className="text-red-500 text-sm">
                    {errors.allowedDiscount.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Admin Info Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Admin Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  placeholder="admin@example.com"
                  {...register("adminEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                />
                {errors.adminEmail && (
                  <p className="text-red-500 text-sm">
                    {errors.adminEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="adminUsername">Admin Username</Label>
                <Input
                  id="adminUsername"
                  placeholder="adminusername"
                  {...register("adminUsername", {
                    required: "Username is required",
                  })}
                />
                {errors.adminUsername && (
                  <p className="text-red-500 text-sm">
                    {errors.adminUsername.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  type="password"
                  id="adminPassword"
                  placeholder="********"
                  {...register("adminPassword", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                {errors.adminPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.adminPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 md:col-span-3">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value="Admin"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  {...register("role")}
                />
              </div>
            </div>
          </div>

          {/* Logo & Description Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Logo & Description
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="logo">Logo</Label>
                <Input
                  type="file"
                  id="logo"
                  {...register("logo", { required: "Logo is required" })}
                />
                {errors.logo && (
                  <p className="text-red-500 text-sm">{errors.logo.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a short description about the company"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="h-24"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2 cursor-pointer">
            Save Company
          </Button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default AddCompanyForm;
