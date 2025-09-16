"use client";
import Image from "next/image";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
type OptionType = {
  value: string;
  label: string;
};

const SelectTenant = () => {
  const [selectedOption, setSelectedOption] =
    useState<SingleValue<OptionType | null>>(null);
  const options: OptionType[] = [
    { value: "Select Tenant", label: "Select Tenant" },
    { value: "tenant1", label: "Tenant 1" },
    { value: "tenant2", label: "Tenant 2" },
    { value: "tenant3", label: "Tenant 3" },
  ];
  const router = useRouter();
  const handleContinueBtn = () => {
    // Handle continue Button click
    if (selectedOption) {
      console.log("Selected Tenant:", selectedOption.value);
    } else {
      console.log("No tenant selected");
    }
    router.push("/dashboard");
  };
  return (
    <div>
      {/* Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-5">
          Hello SuperAdmin
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
          Select Tenant to Continue
        </h2>
        <p className="text-md text-gray-500 text-center mt-1">
          Choose the tenant account you’d like to access.
        </p>

        {/* Dropdown */}
        <div className="mt-6 grid gap-3">
          <Label htmlFor="tenant-dropdown">Tenant</Label>

          <Select
            options={options}
            defaultValue={options[0]}
            placeholder="Search or select tenant..."
            isSearchable
            className="w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedOption}
            onChange={(option) => setSelectedOption(option)}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinueBtn}
            className="w-full cursor-pointer"
            title="Continue to selected tenant"
          >
            Continue
          </Button>
        </div>
        <div className="relative w-full flex items-center my-4">
          <div className="w-full border-b border-gray-200"></div>
          <span className=" absolute left-1/2 -translate-x-1/2 bg-white px-2 text-sm text-gray-500 font-bold">
            OR
          </span>
        </div>

        <Button
          id="create-tenant-btn"
          className="w-full bg-blue-600 hover:bg-blue-800 cursor-pointer"
          onClick={() => router.push("/add-company")}
          title="Create a new tenant"
        >
          Create a new tenant
        </Button>
      </div>
    </div>
  );
};

export default SelectTenant;
