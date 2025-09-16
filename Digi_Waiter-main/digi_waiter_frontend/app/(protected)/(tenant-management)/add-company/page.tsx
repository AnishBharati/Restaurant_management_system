import AddCompanyForm from "@/app/components/Forms/add-company-form";
import React from "react";
import Image from "next/image";
const page = () => {
  return (
    <div>
      <div className="text-center mb-4">
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
          Add the company along with admin details to get started.
        </p>
      </div>
      <AddCompanyForm />
    </div>
  );
};

export default page;
