import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserForm from '../components/AddUserForm';
import EditUserForm from '../components/EditUserForm';
import DeleteUserSection from '../components/DeleteUser';
import LogoutButton from '../components/LogoutButton';

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [filterId, setFilterId] = useState('');
  const [filterRecordId, setFilterRecordId] = useState('');
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

  const handleDelete = async (id) => {
    console.log('Deleting record:', id);
    const token = localStorage.getItem('token');
    const confirmDelete = window.confirm(`Are you sure you want to delete record #${id}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete record');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterId, filterRecordId]);

  const filteredRecords = [...records]
    .filter((r) => {
      const userMatches = filterId ? r.user_id == filterId : true;
      const recordMatches = filterRecordId ? r.id == filterRecordId : true;
      return userMatches && recordMatches;
    })
    .sort((a, b) =>
      sortDateAsc
        ? a.id - b.id
        : b.id - a.id
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

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Edit User</h3>
        <EditUserForm />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Delete User</h3>
        <DeleteUserSection />
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
        <input
          type="number"
          min="1"
          placeholder="Filter by Record ID"
          value={filterRecordId}
          onChange={(e) => setFilterRecordId(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-auto"
        />
        <button
          onClick={() => setSortDateAsc(!sortDateAsc)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          Sort by Record ID ({sortDateAsc ? 'Asc' : 'Desc'})
        </button>
      </div>

      {/* Attendance records */}
      <div className="space-y-4">
        {paginatedRecords.map((rec) => (
          <div
            key={rec.id}
            className="p-4 bg-white rounded shadow flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <img
                src={`http://localhost:3000/uploads/${rec.photo_url}`}
                alt="proof"
                className="w-40 h-auto rounded border"
              />
              <div>
                <p className="text-gray-800 font-medium">User #{rec.user_id}</p>
                <p className="text-gray-600 text-sm">
                  Clock in: #{new Date(rec.clock_in).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">
                  Clock out:{' '}
                  {rec.clock_out
                    ? new Date(rec.clock_out).toLocaleString()
                    : 'Haven\'t clocked out'}
                </p>
                <p className="text-xs text-gray-400">Record ID: {rec.id}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(rec.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
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
