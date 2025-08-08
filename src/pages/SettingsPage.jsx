import React, { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Trash2, Save, Upload } from 'lucide-react';
import ProfileComponent from "../components/ProfileComponent";
import SecurityComponent from "../components/SecurityComponent";
import AppearanceComponent from "../components/AppearanceComponent";
import AdvancedComponent from "../components/AdvancedComponent";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
    // { id: "appearance", name: "Appearance", icon: Palette },
    { id: "advanced", name: "Advanced", icon: Globe },
  ];

  return (
    <div className="px-2 py-2 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <ProfileComponent/>
          )}

          {activeTab === "security" && (
            <SecurityComponent/>
          )}

          {/* {activeTab === "appearance" && (
            <AppearanceComponent/>
          )} */}

          {activeTab === "advanced" && (
            <AdvancedComponent/>
          )}
        </div>
      </div>      
    </div>
  );
};

export default SettingsPage;
