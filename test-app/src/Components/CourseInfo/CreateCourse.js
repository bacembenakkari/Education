import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/athContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    teacherName: '',
    price: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/api/courses/create',
        courseData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate('/admins');
    } catch (error) {
      setError('Failed to create course. Please try again.');
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Create New Course</h1>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3 d-flex justify-content-between">
          <label className="form-label text-center w-25">Title:</label>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            className="form-control w-75"
            required
          />
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <label className="form-label text-center w-25">Description:</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            className="form-control w-75"
            rows="4"
            required
          />
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <label className="form-label text-center w-25">Duration:</label>
          <input
            type="text"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            className="form-control w-75"
            placeholder="e.g., 2h"
            required
          />
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <label className="form-label text-center w-25">Teacher Name:</label>
          <input
            type="text"
            name="teacherName"
            value={courseData.teacherName}
            onChange={handleChange}
            className="form-control w-75"
            required
          />
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <label className="form-label text-center w-25">Price:</label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            className="form-control w-75"
            step="0.01"
            required
          />
        </div>
        <div className="d-flex justify-content-between">
        <button
            type="button"
            onClick={() => navigate('/admins')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
          >
            Create Course
          </button>
        
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
