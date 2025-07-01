import React, { useState } from 'react';
import axios from 'axios';

function AddUserForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:3000/api/auth/register', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User created');
      setForm({ name: '', email: '', password: '', role: 'employee' });
    } catch (err) {
      alert('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New User</h3>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUserForm;
