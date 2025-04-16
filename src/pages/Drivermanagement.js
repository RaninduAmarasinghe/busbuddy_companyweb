import React, { useState } from 'react';

export default function Drivermanagement() {
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
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Driver Management</h2>

        <div className="flex gap-2 mb-4">
          <input
              type="text"
              placeholder="Search by Driver ID or Name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 border rounded w-full"
          />
          <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {loading ? (
            <p>Loading...</p>
        ) : drivers.length === 0 ? (
            <p>No drivers found.</p>
        ) : (
            <table className="w-full border mt-4">
              <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Bus ID</th>
                <th className="p-2 border">Actions</th>
              </tr>
              </thead>
              <tbody>
              {drivers.map((driver) => (
                  <tr key={driver.driverId}>
                    <td className="p-2 border">{driver.driverId}</td>
                    <td className="p-2 border">{driver.driverName}</td>
                    <td className="p-2 border">{driver.driverEmail}</td>
                    <td className="p-2 border">{driver.driverPhone}</td>
                    <td className="p-2 border">{driver.busId}</td>
                    <td className="p-2 border flex gap-2">
                      <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                          onClick={() => openEditModal(driver)}
                      >
                        Edit
                      </button>
                      <button
                          className="bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(driver.driverId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}

        {/* ✨ Edit Modal */}
        {editingDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit Driver</h3>

                <input
                    type="text"
                    value={editForm.driverName}
                    onChange={(e) => setEditForm({ ...editForm, driverName: e.target.value })}
                    placeholder="Name"
                    className="w-full border p-2 mb-2 rounded"
                />

                <input
                    type="email"
                    value={editForm.driverEmail}
                    onChange={(e) => setEditForm({ ...editForm, driverEmail: e.target.value })}
                    placeholder="Email"
                    className="w-full border p-2 mb-2 rounded"
                />

                <input
                    type="tel"
                    value={editForm.driverPhone}
                    onChange={(e) => setEditForm({ ...editForm, driverPhone: e.target.value })}
                    placeholder="Phone"
                    className="w-full border p-2 mb-2 rounded"
                />

                <input
                    type="password"
                    value={editForm.driverPassword}
                    onChange={(e) => setEditForm({ ...editForm, driverPassword: e.target.value })}
                    placeholder="New Password (optional)"
                    className="w-full border p-2 mb-2 rounded"
                />

                <div className="flex justify-end gap-2">
                  <button
                      onClick={() => setEditingDriver(null)}
                      className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded"
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