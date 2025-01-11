import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/athContext';
import { CloudCog, Edit2, Trash2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses/getcourses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token]);

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/delete/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchCourses(); // Refresh the courses list
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again later.');
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="container p-6">
      <h1 className="text-center mb-6">Course Management</h1>
      <div className="d-flex justify-content-between mb-6" style={{ margin: 8 }}>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => navigate('/users')}
          >
            Users
          </button>
          <button 
            className="btn btn-success"
            onClick={() => navigate('/create-course')}
          >
            Create Course
          </button>
        </div>
        <button 
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      
      <div className="table-responsive">
        {courses.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead className="bg-light">
              <tr>
                <th scope="col">Course Title</th>
                <th scope="col">Description</th>
                <th scope="col">Duration</th>
                <th scope="col">Teacher</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="align-middle">
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.duration}</td>
                  <td>{course.teacherName}</td>
                  <td>${course.price}</td>
                  <td>
                    <button 
                      className="btn btn-warning me-2"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4">No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
