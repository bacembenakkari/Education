import React from 'react';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const role = localStorage.getItem('role');

      // Safely parse user data
      let userId;
      try {
        // Handle both string and object formats
        const userObj = typeof storedUser === 'string' ? 
          (storedUser.startsWith('{') ? JSON.parse(storedUser) : { id: storedUser }) : 
          storedUser;
        userId = userObj?.id;
      } catch (e) {
        console.error('Error parsing user data:', e);
        userId = null;
      }

      if (role === 'INSTRUCTOR') {
        window.location.href = '/admins';
        return;
      }

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/enrolled-courses`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized');
          }
          throw new Error('Failed to fetch enrolled courses');
        }

        const data = await response.json();
        setEnrolledCourses(data);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load enrolled courses');
        if (err.message === 'Unauthorized') {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const navigateBack = () => {
    window.location.href = '/user';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Loading your courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center">{error}</div>
        <button 
          onClick={navigateBack}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">My Enrolled Courses</h1>
        <button 
          onClick={navigateBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div 
              key={course.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="mb-1">
                <span className="font-semibold">Duration:</span> {course.duration}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Price:</span> {course.price} €
              </p>
              <p className="mb-2">
                <span className="font-semibold">Teacher:</span> {course.teacherName}
              </p>
              <div className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded">
                Enrolled
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            You haven't enrolled in any courses yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;