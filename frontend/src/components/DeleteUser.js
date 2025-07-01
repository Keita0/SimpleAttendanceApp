import React, { useState } from 'react';
import axios from 'axios';

function DeleteUserSection() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!userId) return alert('Please enter a user ID');
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      alert('User not found');
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const confirmDelete = window.confirm(`Are you sure you want to delete user #${userId}?`);

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User deleted successfully');
      setUser(null);
      setUserId('');
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border px-3 py-2 rounded flex-grow"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load User'}
        </button>
      </div>

      {user && (
        <div className="border p-4 rounded bg-gray-100 space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          
          <div className="flex justify-between">
            <button
              onClick={handleDelete}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete User
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteUserSection;
