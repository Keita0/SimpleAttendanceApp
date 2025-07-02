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
        const sorted = res.data.sort((a, b) => b.id - a.id);
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

  const handleClockOut = async (attendanceId) => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(`http://localhost:3000/api/attendance/clockout/${attendanceId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert(res.data.message);
    // Refresh data after clock-out
    setRecords(prev =>
      prev.map(r =>
        r.id === attendanceId ? { ...r, clock_out: new Date().toISOString() } : r
      )
    );
  } catch (err) {
    console.error('Clock-out failed:', err);
    alert('Clock-out failed. Try again.');
  }
};


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
              <div className="flex-1 text-left space-y-1">
                <p className="text-gray-700 font-medium">
                  Clock In: {new Date(record.clock_in).toLocaleString()}
                </p>

                {record.clock_out ? (
                  <p className="text-green-600">Clocked Out: {new Date(record.clock_out).toLocaleString()}</p>
                ) : (
                  <p className="text-red-600">Not Clocked Out</p>
                )}

                <p className="text-sm text-gray-500">Record ID: {record.id}</p>
              </div>

              {!record.clock_out && (() => {
                const clockInTime = new Date(record.clock_in);
                const now = new Date();
                const hoursSinceClockIn = (now - clockInTime) / (1000 * 60 * 60);
                const isExpired = hoursSinceClockIn > 48;

                return (
                  <button
                    onClick={() => handleClockOut(record.id)}
                    disabled={isExpired}
                    className={`px-4 py-2 rounded ${
                      isExpired
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isExpired ? 'Expired' : 'Clock Out'}
                  </button>
                );
              })()}
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
