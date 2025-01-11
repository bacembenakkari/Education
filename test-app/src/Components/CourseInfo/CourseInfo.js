import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../../context/athContext'; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseInfo.css';

const CourseInfo = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { role, user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'INSTRUCTOR') {
      navigate('/admins');
    }
  }, [navigate, role]);

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const resp = await axios.get('http://localhost:8080/api/courses/getcourses');
        setCourses(resp.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
      }
    };
    getAllCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const userId = user.id;
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}/enrolled-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnrolledCourses(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours inscrits:', error);
      alert('Impossible de récupérer vos cours. Veuillez réessayer plus tard.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const enrollInCourse = async (courseId) => {
    if (!token) {
      alert('Utilisateur non connecté. Veuillez vous connecter.');
      navigate('/login');
      return;
    }

    const userId = user.id;

    if (!userId) {
      alert('Impossible de récupérer vos informations. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/${userId}/enroll/${courseId}`,
        {}, // Empty request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Course enrolled successfully:', response.data);
      alert('Vous êtes inscrit avec succès !');
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, enrolled: true } : course
        )
      );
    } catch (error) {
      console.error('Error during course enrollment:', error);
      if (error.response?.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        navigate('/login');
      }
      if (error.response?.status === 500) {
        alert('Utilisateur déjà inscrit à ce cours.');
      } else {
        alert('Une erreur s\'est produite lors de l\'inscription.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="text-center mb-4">Plateforme Éducative</h1>
        <button className="btn btn-danger" onClick={logout}>
          Déconnexion
        </button>
      </div>
      <h2 className="text-center mb-4">Explorez nos cours</h2>
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={fetchEnrolledCourses}>
          Voir vos cours
        </button>
      </div>
      <div className="row">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="col-md-4 mb-4" key={course.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p><strong>Durée:</strong> {course.duration}</p>
                  <p><strong>Prix:</strong> {course.price} €</p>
                  <p><strong>Enseignant:</strong> {course.teacherName}</p>
                  {role === 'STUDENT' && (
                    <div className="text-center">
                      <button
                        className="btn btn-success"
                        onClick={() => enrollInCourse(course.id)}
                      >
                        S'inscrire
                      </button>
                      {course.enrolled && <p className="text-success mt-2">Vous êtes inscrit avec succès !</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Aucun cours disponible pour le moment.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="enrolled-courses-container">
            {enrolledCourses.length > 0 ? (
              <div className="enrolled-courses-grid">
                {enrolledCourses.map((course) => (
                  <div className="enrolled-course-card" key={course.id}>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Vous n'êtes inscrit à aucun cours.</p>
            )}
            <button className="close-modal-button" onClick={closeModal}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseInfo;
