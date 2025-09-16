import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecentOrdersTable = () => {
  return (
    <div className="m-4 p-4 bg-white shadow-md rounded-lg">
      <div className="text-2xl font-semibold my-3">Recent Orders</div>
      <Table>
        <TableCaption>Recent Orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Chicken Momo</TableCell>
            <TableCell>1</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">Rs. 150.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrdersTable;
