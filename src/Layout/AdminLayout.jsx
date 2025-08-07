// AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, Bell, Search, Menu, X, ChevronDown, LogOut, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState({});
  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", path: "dashboard", icon: LayoutDashboard },
    {
      name: "Users",
      icon: Users,
      children: [
        { name: "Create User", path: "users/create" },
        { name: "List Users", path: "users" }
      ]
    },
    { name: "Settings", path: "settings", icon: Settings },
  ];

const currentPath = location.pathname.replace("/admin/", "");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Admin Panel
              </span>
            </div>
            <button
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <nav>
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          if (hasChildren) {
                            toggleMenu(item.name);
                          } else {
                            navigate(`/admin/${item.path}`);
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <span className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </span>
                        {hasChildren && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${openMenus[item.name] ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>

                      {hasChildren && (
                        <div
                          className={`ml-8 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${openMenus[item.name] ? "max-h-40" : "max-h-0"
                            }`}
                        >
                          {item.children.map((subItem) => (
                            <button
                              key={subItem.name}
                              onClick={() => {
                                navigate(`/admin/${subItem.path}`);
                                setSidebarOpen(false);
                              }}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${currentPath === subItem.path
                                  ? "bg-blue-100 text-blue-800"
                                  : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

            </nav>
          </div>

          <div className="p-4 border-t hidden border-gray-200 md:flex">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <header className="bg-white  shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        My Account
                      </div>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </button>
                      <div className="border-t">
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
