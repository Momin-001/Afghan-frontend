import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/interceptor";
import { CalendarPlus } from "lucide-react";

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    website: "",
    contact_name: "",
    contact_info: "",
    image: null,
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
        await api.post("/afghan/event/", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        navigate("/admin/events");
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Create Event</h1>
          <p className="text-gray-600 mt-2">Add a new event to the system.</p>
        </div>
      </div>

      <main className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New Event</h2>
        <p className="text-sm text-gray-600 mb-8">
          Please fill out the form below to create a new event.
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-6 font-medium bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label htmlFor="venue" className="block mb-2 text-sm font-medium text-gray-700">
                Venue
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Event location"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Describe the event..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-700">
                Website (optional)
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="contact_name" className="block mb-2 text-sm font-medium text-gray-700">
                Contact Name
              </label>
              <input
                id="contact_name"
                name="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="contact_info" className="block mb-2 text-sm font-medium text-gray-700">
                Contact Info
              </label>
              <input
                id="contact_info"
                name="contact_info"
                type="text"
                value={formData.contact_info}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Phone or email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">
              Event Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <CalendarPlus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEventPage;
