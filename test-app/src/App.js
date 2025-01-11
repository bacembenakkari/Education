import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import CourseInfo from './Components/CourseInfo/CourseInfo';
import Login from './Components/auth/login';
import Register from './Components/auth/register';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './context/athContext';
import Admin from './Components/CourseInfo/admins';
import Users from './Components/CourseInfo/Users';
import Home from './Components/Home/home';
import CreateCourse from './Components/CourseInfo/CreateCourse';
import EditCourse from './Components/CourseInfo/EditCourse';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={['STUDENT']}>
                <CourseInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <PrivateRoute allowedRoles={['INSTRUCTOR']}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={['INSTRUCTOR']}>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-course"
            element={
              <PrivateRoute allowedRoles={['INSTRUCTOR']}>
                <CreateCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-course/:courseId"
            element={
              <PrivateRoute allowedRoles={['INSTRUCTOR']}>
                <EditCourse />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;