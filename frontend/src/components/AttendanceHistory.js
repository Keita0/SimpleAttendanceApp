import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.id;

      try {
        const res = await axios.get(`http://localhost:3000/api/attendance/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecords(sorted);
      } catch (err) {
        console.error('Failed to load attendance:', err);
      }
    };

    fetchAttendance();
  }, []);

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const paginated = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <>
          {paginated.map(record => (
            <div
              key={record.id}
              className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded shadow-sm bg-white"
            >
              <img
                src={`http://localhost:3000/uploads/${record.photo_url}`}
                alt="proof"
                className="w-40 h-auto rounded border"
              />
              <div className="text-left">
                <p className="text-gray-700 font-medium">
                  {new Date(record.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Record ID: {record.id}</p>
              </div>
            </div>
          ))}

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
        </>
      )}
    </div>
  );
}

export default AttendanceHistory;
