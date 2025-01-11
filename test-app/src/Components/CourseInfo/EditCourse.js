import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/athContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useContext(AuthContext);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    teacherName: '',
    price: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/get/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCourseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchCourse();
    }
  }, [courseId, token]);

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
      await axios.put(
        `http://localhost:8080/api/courses/update/${courseId}`,
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
      setError('Failed to update course. Please try again.');
      console.error('Error updating course:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading course details...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Course</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <label htmlFor="title" className="col-sm-2 col-form-label text-center">Title:</label>
          <div className="col-sm-10">
            <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="description" className="col-sm-2 col-form-label text-center">Description:</label>
          <div className="col-sm-10">
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="duration" className="col-sm-2 col-form-label text-center">Duration:</label>
          <div className="col-sm-10">
            <input
              type="text"
              id="duration"
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 2h"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="teacherName" className="col-sm-2 col-form-label text-center">Teacher Name:</label>
          <div className="col-sm-10">
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              value={courseData.teacherName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="price" className="col-sm-2 col-form-label text-center">Price:</label>
          <div className="col-sm-10">
            <input
              type="number"
              id="price"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="form-control"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" onClick={() => navigate('/admins')} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-warning">Update Course</button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
