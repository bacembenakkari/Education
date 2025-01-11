import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/athContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/getusers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleBackToAdmin = () => {
    navigate('/admins');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getUserStats = () => {
    const total = users.length;
    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    return { total, roleCount };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-primary fw-bold">User Management</h1>
            <p className="text-muted">Manage and monitor all system users</p>
          </div>
          <button 
            onClick={handleBackToAdmin}
            className="btn btn-primary"
          >
            ← Back to Admin
          </button>
        </div>

        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3 mb-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-control"
            >
              <option value="all">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
            </select>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body">
                <div className="text-muted">Total Users</div>
                <div className="mt-2 text-primary fs-4 fw-bold">{stats.total}</div>
              </div>
            </div>
          </div>
          {Object.entries(stats.roleCount).map(([role, count]) => (
            <div key={role} className="col-md-3">
              <div className="card bg-white shadow-sm">
                <div className="card-body">
                  <div className="text-muted">{role}s</div>
                  <div className="mt-2 text-primary fs-4 fw-bold">{count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <strong>Error!</strong> {error}
          </div>
        )}

        <div className="card bg-white shadow-sm">
          <div className="card-body">
            {filteredUsers.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ms-2">{user.username}</div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'INSTRUCTOR' ? 'bg-danger' : 'bg-success'} text-white`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success text-white">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">
                <svg className="mb-2 text-muted" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20v-6m0 0l2-2m-2 2l-2-2m0 6a6 6 0 110-12 6 6 0 010 12z" />
                </svg>
                <h5>No users found</h5>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
