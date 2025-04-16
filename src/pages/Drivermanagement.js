import React, { useState } from 'react';

export default function DriverManagement() {
  const [query, setQuery] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editForm, setEditForm] = useState({
    driverName: '',
    driverEmail: '',
    driverPhone: '',
    driverPassword: '',
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/driver/search?query=${query}`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await fetch(`http://localhost:8080/driver/delete/${driverId}`, { method: 'DELETE' });
      setDrivers(drivers.filter((d) => d.driverId !== driverId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setEditForm({
      driverName: driver.driverName,
      driverEmail: driver.driverEmail,
      driverPhone: driver.driverPhone,
      driverPassword: '', // leave empty for security
    });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/driver/update/${editingDriver.driverId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert("Driver updated successfully");
        handleSearch();
        setEditingDriver(null);
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center p-6">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-gray-900/50 backdrop-blur-md border border-cyan-300/20 shadow-xl p-6 rounded-2xl">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-3xl font-bold mb-6">
            Driver Management
          </h2>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
                type="text"
                placeholder="Search by Driver ID or Name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-all"
            >
              Search
            </button>
          </div>

          {/* Driver Table */}
          {loading ? (
              <p className="text-gray-200">Loading...</p>
          ) : drivers.length === 0 ? (
              <p className="text-gray-400">No drivers found.</p>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700 text-gray-100">
                  <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Bus ID</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {drivers.map((driver) => (
                      <tr key={driver.driverId} className="border-b border-gray-700">
                        <td className="p-3">{driver.driverId}</td>
                        <td className="p-3">{driver.driverName}</td>
                        <td className="p-3">{driver.driverEmail}</td>
                        <td className="p-3">{driver.driverPhone}</td>
                        <td className="p-3">{driver.busId}</td>
                        <td className="p-3 space-x-2">
                          <button
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:opacity-90"
                              onClick={() => openEditModal(driver)}
                          >
                            Edit
                          </button>
                          <button
                              className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90"
                              onClick={() => handleDelete(driver.driverId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-900/70 border border-cyan-300/10 shadow-lg p-6 rounded-xl w-full max-w-md">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">
                  Edit Driver
                </h3>

                <input
                    type="text"
                    value={editForm.driverName}
                    onChange={(e) => setEditForm({ ...editForm, driverName: e.target.value })}
                    placeholder="Name"
                    className="w-full mb-3 bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />

                <input
                    type="email"
                    value={editForm.driverEmail}
                    onChange={(e) => setEditForm({ ...editForm, driverEmail: e.target.value })}
                    placeholder="Email"
                    className="w-full mb-3 bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />

                <input
                    type="tel"
                    value={editForm.driverPhone}
                    onChange={(e) => setEditForm({ ...editForm, driverPhone: e.target.value })}
                    placeholder="Phone"
                    className="w-full mb-3 bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />

                <input
                    type="password"
                    value={editForm.driverPassword}
                    onChange={(e) => setEditForm({ ...editForm, driverPassword: e.target.value })}
                    placeholder="New Password (optional)"
                    className="w-full mb-4 bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />

                <div className="flex justify-end gap-2">
                  <button
                      onClick={() => setEditingDriver(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:opacity-90 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded hover:opacity-90 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}