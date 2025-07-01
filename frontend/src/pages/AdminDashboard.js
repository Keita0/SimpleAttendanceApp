import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserForm from '../components/AddUserForm';
import LogoutButton from '../components/LogoutButton';

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [filterId, setFilterId] = useState('');
  const [sortDateAsc, setSortDateAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const fetchRecords = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:3000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error('Failed to fetch records', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterId]);

  // Filter, sort, and paginate
  const filteredRecords = [...records]
    .filter((r) => (filterId ? r.user_id == filterId : true))
    .sort((a, b) =>
      sortDateAsc
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp)
    );

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-1000">Admin Dashboard</h2>
        <LogoutButton />
      </div>

      {/* Add user form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Add New User</h3>
        <AddUserForm />
      </div>

      {/* Filter and sort controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded shadow">
        <input
          type="number"
          min="1"
          placeholder="Filter by User ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-auto"
        />
        <button
          onClick={() => setSortDateAsc(!sortDateAsc)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          Sort by Date ({sortDateAsc ? 'Old → New' : 'New → Old'})
        </button>
      </div>

      {/* Attendance records */}
      <div className="space-y-4">
        {paginatedRecords.map((rec) => (
          <div
            key={rec.id}
            className="p-4 bg-white rounded shadow flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            <img
              src={`http://localhost:3000/uploads/${rec.photo_url}`}
              alt="proof"
              className="w-40 h-auto rounded border"
            />
            <div>
              <p className="text-gray-800 font-medium">User #{rec.user_id}</p>
              <p className="text-gray-600 text-sm">
                {new Date(rec.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Record ID: {rec.id}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
