"use client";
import { useState } from "react";
import MenteeProfile from "@/app/components/settings/MenteeProfile";
import PersonalProfile from "@/app/components/settings/PersonalProfile";
import LoginSecurity from "@/app/components/settings/LoginSecurity";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("mentee"); // Default to 'Mentee Profile'

  const renderContent = () => {
    switch (activeTab) {
      case "mentee":
        return <MenteeProfile />;
      case "personal":
        return <PersonalProfile />;
      case "security":
        return <LoginSecurity />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6 text-zinc-600">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 ${
            activeTab === "personal"
              ? "border-b-2 border-emerald-800 text-emerald-600 font-semibold text-sm"
              : "text-gray-600 hover:text-blue-600 font-semibold"
          }`}
        >
          Personal Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 ${
            activeTab === "security"
              ? "border-b-2 border-emerald-800 text-emerald-600 text-sm"
              : "text-gray-600 hover:text-blue-600 font-semibold"
          }`}
        >
          Login & Security
        </button>
      </div>

      {/* Content */}
      <div className="">{renderContent()}</div>
    </div>
  );
}
