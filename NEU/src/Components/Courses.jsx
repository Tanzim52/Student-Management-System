import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Courses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/students/courses');
      
      console.log('Full API Response:', response);
      
      // Simplified response handling
      if (response && response.success) {
        setEnrolledCourses(response.enrolled || []);
        setAvailableCourses(response.available || []);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);

  // ... rest of your component code ...

const handleEnroll = async (courseId) => {
  try {
    await api.post('/api/students/enroll', { courseId });
    // Refresh courses after enrollment
    const response = await api.get('/api/students/courses');
    if (response && response.success) {
      setEnrolledCourses(response.enrolled || []);
      setAvailableCourses(response.available || []);
    }
  } catch (err) {
    console.error('Enrollment failed:', err);
    setError(err.response?.data?.error || err.message || 'Failed to enroll');
  }
};

  if (loading) {
    return (
      <div className="p-6 ml-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Courses</h1>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 ml-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Courses</h1>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 ml-0"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Courses</h1>

      {/* Enrolled Courses */}
      <div className="card bg-base-200 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Enrolled Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Semester</th>
                    <th>Status</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledCourses.map((course) => (
                    <tr key={course.course_id}>
                      <td>
                        <div className="font-medium">{course.code}: {course.title}</div>
                        <div className="text-sm opacity-70">{course.credits} Credits</div>
                      </td>
                      <td>{course.instructor || '-'}</td>
                      <td>{course.semester_offered || '-'}</td>
                      <td>
                        <span className={`badge ${
                          course.status === 'Completed' ? 'badge-success' : 'badge-primary'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td>{course.grade || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>You are not currently enrolled in any courses.</p>
          )}
        </div>
      </div>

      {/* Available Courses */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Available Courses</h2>
          {availableCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Semester</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableCourses.map((course) => (
                    <tr key={course.course_id}>
                      <td>
                        <div className="font-medium">{course.code}: {course.title}</div>
                        <div className="text-sm opacity-70">{course.credits} Credits</div>
                      </td>
                      <td>{course.instructor || '-'}</td>
                      <td>{course.semester_offered || '-'}</td>
                      <td>
                        <button 
                          onClick={() => handleEnroll(course.course_id)}
                          className="btn btn-sm btn-primary"
                        >
                          Enroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No available courses to enroll in at this time.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Courses;