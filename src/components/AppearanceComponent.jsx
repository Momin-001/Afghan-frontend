import React, { useState } from 'react'
import { Save } from 'lucide-react';

function AppearanceComponent() {
    const [theme, setTheme] = useState("light");

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Customize the look and feel of your admin panel.</p>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="text-base font-medium text-gray-700">Theme</label>
                    <p className="text-sm text-gray-500 mb-4">Choose your preferred theme for the interface</p>
                    <div className="grid grid-cols-3 gap-4">
                        {["light", "dark", "system"].map((themeOption) => (
                            <div
                                key={themeOption}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${theme === themeOption ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                    }`}
                                onClick={() => setTheme(themeOption)}
                            >
                                <div className="text-center">
                                    <div
                                        className={`w-12 h-8 mx-auto mb-2 rounded ${themeOption === "light"
                                            ? "bg-white border"
                                            : themeOption === "dark"
                                                ? "bg-gray-900"
                                                : "bg-gradient-to-r from-white to-gray-900"
                                            }`}
                                    />
                                    <p className="text-sm font-medium capitalize">{themeOption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <Save className="mr-2 h-4 w-4" />
                        Save Appearance
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AppearanceComponent