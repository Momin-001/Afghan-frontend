import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/interceptor";
import { UserPlus } from "lucide-react";

const CreateUserPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/afghan/user/", formData);
      navigate("/admin/users");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="px-2 py-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Create Users</h1>
            <p className="text-gray-600 mt-2">Manage your user accounts and add new users.</p>
          </div>

        </div>

      <main className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New User</h2>
        <p className="text-sm text-gray-600 mb-8">
          Please fill out the form below to create a new user account.
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-6 font-medium bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="John"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <UserPlus className="w-5 h-5" />
              Create User
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateUserPage;
