import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceHistory() {
  const [records, setRecords] = useState([]);

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

  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        records.map(record => (
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
        ))
      )}
    </div>
  );
}

export default AttendanceHistory;
