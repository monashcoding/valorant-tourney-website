import React, { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

function AdminPanel() {
  const [token, setToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [currentToken, setCurrentToken] = useState("");

  const {
    data,
    editedData,
    loading,
    error,
    saveStatus,
    fetchData,
    updateEditedData,
    saveData,
  } = useAdminData(currentToken);

  const handleTokenSubmit = () => {
    if (token.trim()) {
      setCurrentToken(token);
      setShowTokenInput(false);
    } else {
      // Error handling for empty token can be added via a local state if needed
    }
  };

  const handleLogout = () => {
    setShowTokenInput(true);
    setCurrentToken("");
    setToken("");
    // Hook will refetch on next mount, but since token changes, it effectively resets
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateEditedData(e.target.value);
  };

  const handleSave = () => {
    saveData(editedData);
  };

  const handleReset = () => {
    if (data) {
      updateEditedData(JSON.stringify(data, null, 2));
    }
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="border border-yellow-400 bg-neutral-900 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Admin Access
          </h2>
          <input
            type="password"
            placeholder="Enter admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded mb-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleTokenSubmit}
            className="w-full py-3 bg-yellow-400 rounded font-bold hover:bg-yellow-500 text-black transition-colors"
          >
            Enter Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Tournament Admin Panel
          </h1>
          <div className="flex items-center space-x-4">
            <input
              type="password"
              placeholder="Admin Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-2 bg-neutral-800 rounded text-white w-64"
            />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-neutral-800 rounded text-white hover:bg-neutral-700"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-400 p-4 rounded mb-4 text-black">
            {error}
          </div>
        )}
        {saveStatus && (
          <div className="p-4 rounded mb-4 bg-yellow-400 text-black">
            {saveStatus}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white">
            Loading tournament data...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Current Data (Read-Only)
              </h2>
              <pre className="bg-neutral-800 p-4 rounded overflow-auto h-96 text-sm font-mono text-white">
                {JSON.stringify(data, null, 2)}
              </pre>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-yellow-400 rounded text-black hover:bg-yellow-500"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Edit Tournament Data (JSON)
              </h2>
              <p className="text-white text-sm">
                Edit the JSON below. Dates should be in ISO string format (e.g.,
                "2024-09-27T00:00:00.000Z"). Save to update the backend.
              </p>
              <textarea
                rows={25}
                className="w-full bg-neutral-800 p-4 rounded overflow-auto font-mono text-sm text-white resize-none"
                value={JSON.stringify(editedData, null, 2)}
                onChange={handleJsonChange}
                placeholder='{"name": "Tournament Name", "startDate": "2024-09-27T00:00:00.000Z", ...}'
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-yellow-400 rounded font-bold text-black hover:bg-yellow-500 transition-colors"
                  disabled={!editedData || loading}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-neutral-800 rounded font-bold text-white hover:bg-neutral-700"
                  disabled={!data}
                >
                  Reset to Current
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
