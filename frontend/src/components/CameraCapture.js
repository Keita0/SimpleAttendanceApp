import React, { useRef, useState } from 'react';
import axios from 'axios';

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Start camera
  const startCamera = async () => {
    setSubmitted(false);
    setPreview(null);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // Capture photo
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    setPreview(imageData);

    // stop camera
    video.srcObject.getTracks().forEach(track => track.stop());
  };

  // Upload to backend
  const submitAttendance = async () => {
    const token = localStorage.getItem('token');
    const userId = parseInt(JSON.parse(atob(token.split('.')[1])).id); // extract from token

    const blob = await (await fetch(preview)).blob();
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');
    formData.append('user_id', userId); // temporary — we'll replace with req.user on backend later

    try {
      await axios.post('http://localhost:3000/api/attendance', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Attendance submitted!');
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting attendance');
    }
  };

  return (
    <div>
      {!preview && <button onClick={startCamera}>Start Camera</button>}
      <video ref={videoRef} autoPlay style={{ width: '300px' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {preview && (
        <div>
          <img src={preview} alt="preview" style={{ width: '300px' }} />
          <button onClick={submitAttendance}>Submit Attendance</button>
        </div>
      )}

      {!preview && <button onClick={takePhoto}>Capture Photo</button>}
      {submitted && <p>Submitted successfully!</p>}
    </div>
  );
}

export default CameraCapture;
