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
        setRecords(res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <h3>Your Attendance History</h3>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            {new Date(record.timestamp).toLocaleString()} <br />
            <img src={`http://localhost:3000/uploads/${record.photo_url}`} alt="proof" width="200" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendanceHistory;
