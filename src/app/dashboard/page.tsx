import type { Metadata } from "next";
import React from "react";

// Placeholder components - replace with actual dashboard components
const PlaceholderWidget: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white shadow rounded-lg p-4 min-h-[100px] flex items-center justify-center">
    <p className="text-gray-500 text-lg">{title}</p>
  </div>
);


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Main user dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-6">
      <div className="col-span-12">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to your Dashboard</h1>
      </div>
      
      {/* Example Widgets - Replace or extend these */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <PlaceholderWidget title="Widget 1" />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <PlaceholderWidget title="Widget 2" />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <PlaceholderWidget title="Widget 3" />
      </div>
       <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <PlaceholderWidget title="Widget 4" />
      </div>

      {/* Add more dashboard specific components here */}
      {/* For example:
      <div className="col-span-12 xl:col-span-7">
        <YourDashboardChartComponent />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <YourDashboardSummaryComponent />
      </div>
      */}
    </div>
  );
} 