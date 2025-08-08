import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Building2,
  Tag,
  CalendarPlus,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: 0,
      target: 1,
      icon: Users,
      color: "text-blue-600",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Total Businesses",
      value: 0,
      target: 52,
      icon: Building2,
      color: "text-green-600",
      gradient: "from-green-50 to-green-100",
    },
    {
      title: "Total Categories",
      value: 0,
      target: 25,
      icon: Tag,
      color: "text-purple-600",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Total Events",
      value: 0,
      target: 0,
      icon: CalendarPlus,
      color: "text-orange-600",
      gradient: "from-orange-50 to-orange-100",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.value < stat.target) {
            return { ...stat, value: stat.value + 1 };
          }
          return stat;
        })
      );
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const actions = [
    {
      title: "Add User",
      description: "Create a new user account",
      color: "bg-blue-500",
      icon: UserPlus,
    },
    {
      title: "Add Business",
      description: "Add a new business",
      color: "bg-green-500",
      icon: Building2,
    },
    {
      title: "Add Category",
      description: "Add a new category",
      color: "bg-purple-500",
      icon: Tag,
    },
    {
      title: "Add Event",
      description: "Add a new event",
      color: "bg-orange-500",
      icon: CalendarPlus,
    },
  ];

  return (
    <div className="px-2 py-2 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your admin panel.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-full bg-white shadow-sm`}>
                  <Icon className={`h-7 w-7 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-600 mt-1">
            Frequently used actions for faster workflow
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <ActionIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
