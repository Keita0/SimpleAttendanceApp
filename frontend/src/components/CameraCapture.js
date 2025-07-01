import React, { useRef, useState } from 'react';
import axios from 'axios';

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setSubmitted(false);
    setPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      alert('Unable to access camera');
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // ✅ Check if video stream is available
    if (!video.srcObject) {
      alert('No camera detected or camera not started. Please click "Start Camera" first.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');
    setPreview(imageData);

    // Stop the camera stream
    video.srcObject.getTracks().forEach((track) => track.stop());
  };

  const submitAttendance = async () => {
    if (!preview) return;
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const userId = parseInt(JSON.parse(atob(token.split('.')[1])).id);

    const blob = await (await fetch(preview)).blob();
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');
    formData.append('user_id', userId);

    try {
      await axios.post('http://localhost:3000/api/attendance', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSubmitted(true);
      alert('Attendance submitted!');
    } catch (err) {
      alert('Error submitting attendance.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-center">
      {!preview && (
        <button
          onClick={startCamera}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Start Camera
        </button>
      )}

      <div className="flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          className={`${preview ? 'hidden' : ''} w-full max-w-sm border rounded`}
        ></video>
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>

      {!preview && (
        <button
          onClick={takePhoto}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Capture Photo
        </button>
      )}

      {preview && (
        <div className="space-y-4">
          <img src={preview} alt="Captured" className="w-full max-w-sm border rounded mx-auto" />
          <button
            onClick={submitAttendance}
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white px-4 py-2 rounded transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      )}

      {submitted && (
        <p className="text-green-600 font-semibold">Attendance submitted successfully!</p>
      )}
    </div>
  );
}

export default CameraCapture;
