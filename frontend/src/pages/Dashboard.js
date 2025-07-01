import React, { useEffect } from 'react';
import CameraCapture from '../components/CameraCapture';
import AttendanceHistory from '../components/AttendanceHistory';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function Dashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin') {
      // Redirect admins to their own dashboard
      navigate('/admin');
    }
  }, [role, navigate]);

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <LogoutButton />
      <CameraCapture />
      <AttendanceHistory />
    </div>
  );
}

export default Dashboard;
