import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/interceptor";
import { UserPlus } from "lucide-react";

const CreateBusinessPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [error, setError] = useState(null);
    const [latLonError, setLatLonError] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        contact_email: "",
        contact_phone: "",
        address: "",
        category: "",
        province: "",
        facebook_link: "",
        instagram_link: "",
        youtube_link: "",
        website_link: "",
        map_location_url: "",
        featured: false,
        image: null,
    });

const extractLatLonFromGoogleMapsUrl = (url) => {
    try {
        const parsed = new URL(url);
        const isGoogleMaps = parsed.hostname === "www.google.com" && parsed.pathname.startsWith("/maps/");
        if (!isGoogleMaps) {
            return { error: "URL must be from 'https://www.google.com/maps/'" };
        }

        const match = url.match(/@([-+]?\d*\.\d+),([-+]?\d*\.\d+)/);
        if (!match) {
            return { error: "Coordinates not found in URL. Make sure the URL includes '@lat,lon'" };
        }

        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);

        if (isNaN(latitude) || isNaN(longitude)) {
            return { error: "Coordinates could not be parsed as valid numbers." };
        }

        return { latitude, longitude };
    } catch {
        return { error: "Invalid URL format." };
    }
};


    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [catRes, provRes] = await Promise.all([
                    api.get("/afghan/category/"),
                    api.get("/afghan/province/"),
                ]);
                setCategories(catRes.data);
                setProvinces(provRes.data);
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };

        fetchDropdownData();
    }, []);

const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;
    let updatedValue;

    if (type === "checkbox") {
        updatedValue = checked;
    } else if (type === "file") {
        updatedValue = files[0];
    } else {
        updatedValue = value;
    }

    setFormData((prev) => ({
        ...prev,
        [name]: type === "file" ? updatedValue : updatedValue,
    }));

    // Special handling for map URL
    if (name === "map_location_url" && type !== "file" && type !== "checkbox") {
        const result = extractLatLonFromGoogleMapsUrl(updatedValue);

        if (result.error) {
            setLatLonError(result.error);
            setLatitude("");
            setLongitude("");
        } else {
            setLatLonError(null);
            setLatitude(result.latitude.toString());
            setLongitude(result.longitude.toString());
        }
    }
};


    const handleSubmit = async (e) => {
    e.preventDefault();

    if (latLonError) {
        setError("Cannot submit: Map URL is invalid.");
        return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            data.append(key, value);
}

    });

    if (latitude && longitude) {
        data.append("latitude", latitude);
        data.append("longitude", longitude);
    }

    try {
        await api.post("/afghan/business/", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        navigate("/admin/businesses");
    } catch (err) {
        console.error("Error creating business:", err);
        setError("Failed to create business. Please try again.");
    }
};


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Create Business</h1>
                    <p className="text-gray-600 mt-2">Add a new business to the directory.</p>
                </div>
            </div>

            <main className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New Business</h2>
                <p className="text-sm text-gray-600 mb-8">
                    Please fill out the form below to register a new business.
                </p>

                {error && (
                    <p className="text-red-600 text-sm mb-6 font-medium bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                Business Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Enter business name"
                            />
                        </div>

                        <div>
                            <label htmlFor="contact_email" className="block mb-2 text-sm font-medium text-gray-700">
                                Contact Email
                            </label>
                            <input
                                id="contact_email"
                                name="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={handleChange}
                                required
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="contact_phone" className="block mb-2 text-sm font-medium text-gray-700">
                                Contact Phone
                            </label>
                            <input
                                id="contact_phone"
                                name="contact_phone"
                                type="text"
                                value={formData.contact_phone}
                                onChange={handleChange}
                                required
                                placeholder="Phone number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="map_location_url" className="block mb-2 text-sm font-medium text-gray-700">
                                Map Location URL
                            </label>
                            <input
                                id="map_location_url"
                                name="map_location_url"
                                type="url"
                                value={formData.map_location_url}
                                onChange={handleChange}
                                required
                                placeholder="Google Maps URL"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            />
                            {latLonError && (
                            <p className="text-red-600 text-sm mt-1">{latLonError}</p>
                                            )}

                        </div>
                        <div>
                            <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-gray-700">
                                Latitude
                            </label>
                            <input
                                id="latitude"
                                name="latitude"
                                type="text"
                                value={latitude}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="longitude" className="block mb-2 text-sm font-medium text-gray-700">
                                Longitude
                            </label>
                            <input
                                id="longitude"
                                name="longitude"
                                type="text"
                                value={longitude}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>

                    </div>

                    <div>
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Business address"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="province" className="block mb-2 text-sm font-medium text-gray-700">
                                Province
                            </label>
                            <select
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Province</option>
                                {provinces.map((prov) => (
                                    <option key={prov.id} value={prov.id}>{prov.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="facebook_link" className="block mb-2 text-sm font-medium text-gray-700">
                                Facebook Link
                            </label>
                            <input
                                id="facebook_link"
                                name="facebook_link"
                                type="url"
                                value={formData.facebook_link}
                                onChange={handleChange}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="instagram_link" className="block mb-2 text-sm font-medium text-gray-700">
                                Instagram Link
                            </label>
                            <input
                                id="instagram_link"
                                name="instagram_link"
                                type="url"
                                value={formData.instagram_link}
                                onChange={handleChange}
                                placeholder="https://instagram.com/yourpage"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="youtube_link" className="block mb-2 text-sm font-medium text-gray-700">
                                YouTube Link
                            </label>
                            <input
                                id="youtube_link"
                                name="youtube_link"
                                type="url"
                                value={formData.youtube_link}
                                onChange={handleChange}
                                placeholder="https://youtube.com/yourchannel"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="website_link" className="block mb-2 text-sm font-medium text-gray-700">
                                Website Link
                            </label>
                            <input
                                id="website_link"
                                name="website_link"
                                type="url"
                                value={formData.website_link}
                                onChange={handleChange}
                                placeholder="https://yourwebsite.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">
                                Business Image
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
                            />
                        </div>

                        <div className="flex items-center mt-8">
                            <input
                                id="featured"
                                name="featured"
                                type="checkbox"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                                Mark as Featured
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <UserPlus className="w-5 h-5" />
                            Create Business
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateBusinessPage;
