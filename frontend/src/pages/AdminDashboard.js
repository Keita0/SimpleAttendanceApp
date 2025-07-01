import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserForm from '../components/AddUserForm';
import LogoutButton from '../components/LogoutButton';

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [filterId, setFilterId] = useState('');
  const [sortDateAsc, setSortDateAsc] = useState(true);

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

  // Sorting logic
  const sortedRecords = [...records]
    .filter(r => (filterId ? r.user_id === filterId : true))
    .sort((a, b) =>
      sortDateAsc
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp)
    );

  return (
    <div>
      <h2>Admin Attendance Monitor</h2>
      <LogoutButton />
      <AddUserForm />

      <div>
        <input
          type="number"
          min="1"
          placeholder="Filter by User ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />
        <button onClick={() => setSortDateAsc(!sortDateAsc)}>
          Sort by Date ({sortDateAsc ? 'Old → New' : 'New → Old'})
        </button>
      </div>

      <ul>
        {sortedRecords.map((rec) => (
          <li key={rec.id}>
            <strong>User #{rec.user_id}</strong><br />
            {new Date(rec.timestamp).toLocaleString()} <br />
            <img
              src={`http://localhost:3000/uploads/${rec.photo_url}`}
              alt="proof"
              width="200"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
