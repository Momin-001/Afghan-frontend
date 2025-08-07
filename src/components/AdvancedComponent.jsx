import React, { useState } from 'react'
import { Trash2 } from 'lucide-react';

function AdvancedComponent() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
                    <p className="text-sm text-gray-600 mt-1">Advanced configuration options and account management.</p>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <p className="text-sm text-gray-500 mb-4">Choose your preferred language</p>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="en" selected>English</option>
                            <option value="es">Farsi</option>
                        </select>
                    </div>

                    <div className="border-t pt-6">
                        <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
                        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-900">Delete Account</p>
                                    <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {showDeleteDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Are you absolutely sure?</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteDialog(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowDeleteDialog(false)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdvancedComponent