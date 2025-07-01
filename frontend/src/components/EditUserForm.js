import React, { useState } from 'react';
import axios from 'axios';

function EditUserForm({ onCancel, onUpdate }) {
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'employee',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleIdChange = (e) => setUserId(e.target.value);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchUser = async () => {
    if (!userId) return alert('Please enter a user ID');
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        password: '' // empty field to be submitted if unchanged
      });
      setLoaded(true);
    } catch (err) {
      alert('User not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:3000/api/users/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User updated');
      onUpdate?.(); // optional callback
    } catch (err) {
      alert('Failed to update user');
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
          onChange={handleIdChange}
          className="border px-3 py-2 rounded flex-grow"
        />
        <button
          onClick={fetchUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load User'}
        </button>
      </div>

      {loaded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleFormChange}
              className="mt-1 w-full px-3 py-2 border rounded"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-gray-400">(leave blank to keep unchanged)</span>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleFormChange}
              placeholder="New Password"
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditUserForm;
