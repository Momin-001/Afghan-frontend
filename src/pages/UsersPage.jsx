import React, { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Filter, Slash } from "lucide-react";
import api from "../lib/interceptor";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/afghan/user/");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/afghan/user/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };


  const handleEnable = async (user) => {
    try {
      await api.patch(`/afghan/user/${user.id}/`, { is_active: true });
      setUsers(users.map((u) => (u.id === user.id ? { ...u, is_active: true } : u)));
    } catch (error) {
      console.error("Failed to enable user:", error);
    }
  };

  const handleDisable = async (user) => {
    try {
      await api.patch(`/afghan/user/${user.id}/`, { is_active: false });
      setUsers(users.map((u) => (u.id === user.id ? { ...u, is_active: false } : u)));
    } catch (error) {
      console.error("Failed to disable user:", error);
    }
  };

  const getStatusBadge = (is_active) => {
    return is_active ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  const getRoleBadge = (is_super_admin) => {
    const role = is_super_admin ? "SuperAdmin" : "Admin";
    const color = is_super_admin
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {role}
      </span>
    );
  };

  const filteredUsers = users
    .filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((user) => {
      if (filter === "active") return user.is_active;
      if (filter === "inactive") return !user.is_active;
      return true;
    });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">Manage your team members and their permissions</p>
          </div>
          <button
            onClick={() => navigate("/admin/users/create")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>

        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${filter === "all" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-700"
                }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${filter === "active" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-700"
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${filter === "inactive" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-700"
                }`}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border hidden sm:block border-gray-200 overflow-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.is_super_admin)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.is_active)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-right relative">
                    {loggedInUser.id !== user.id && loggedInUser?.is_super_admin && (
                      <>
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                          className="text-gray-400 hover:text-gray-600 p-2"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {dropdownOpen === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <div className="px-4 py-2 text-sm text-gray-700 border-b">Actions</div>

                              {user.is_active ? (
                                <button
                                  onClick={() => handleDisable(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                                >
                                  <Slash className="mr-2 h-4 w-4" />
                                  Disable
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEnable(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                >
                                  <Slash className="mr-2 h-4 w-4 rotate-180" />
                                  Enable
                                </button>
                              )}

                              <button
                                onClick={() => handleDelete(user.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden space-y-5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white border rounded-lg p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-base font-medium text-gray-700">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{user.username}</div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                <span className="text-gray-800">{user.email}</span>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Role:</span>{" "}
                <span className="ml-1">{getRoleBadge(user.is_super_admin)}</span>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span className="ml-1">{getStatusBadge(user.is_active)}</span>
              </div>

              {loggedInUser.id !== user.id && loggedInUser?.is_super_admin && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {user.is_active ? (
                    <button
                      onClick={() => handleDisable(user)}
                      className="flex items-center px-4 py-2 text-sm text-yellow-700 border border-yellow-300 rounded-md bg-yellow-50 hover:bg-yellow-100"
                    >
                      <Slash className="mr-2 h-4 w-4" />
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnable(user)}
                      className="flex items-center px-4 py-2 text-sm text-green-700 border border-green-300 rounded-md bg-green-50 hover:bg-green-100"
                    >
                      <Slash className="mr-2 h-4 w-4 rotate-180" />
                      Enable
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex items-center px-4 py-2 text-sm text-red-700 border border-red-300 rounded-md bg-red-50 hover:bg-red-100"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default UsersPage;
