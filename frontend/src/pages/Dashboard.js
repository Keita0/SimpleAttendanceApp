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
      navigate('/admin');
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Employee Dashboard</h2>
          <LogoutButton />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Submission</h3>
          <CameraCapture />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-lg font-semibold text-gray-700 mb-4">Your Attendance History</h1>
          <AttendanceHistory />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
