import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Grades = () => {
  const { student } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gradesData, setGradesData] = useState({
    currentGrades: [],
    completedGrades: [],
    gpaSummary: {
      current: "0.00",
      cumulative: "0.00",
      creditsCompleted: 0,
      creditsInProgress: 0
    }
  });

useEffect(() => {
  const fetchGradesData = async () => {
    try {
      setLoading(true);
      
      // Remove axios-specific checks
      console.log('Starting fetch...');
      
      // Use your custom API implementation
      const response = await api.get('/api/students/grades-summary');
      
      console.log('Response data:', response);
      
      // Format the response to match your expected structure
      const data = response || {
        currentGrades: [],
        completedGrades: [],
        gpaSummary: {
          current: "0.00",
          cumulative: "0.00",
          creditsCompleted: 0,
          creditsInProgress: 0
        }
      };
      
      setGradesData(data);
      
    } catch (error) {
      console.error('COMPLETE ERROR OBJECT:', error);
      
      setGradesData({
        currentGrades: [],
        completedGrades: [],
        gpaSummary: {
          current: "0.00",
          cumulative: "0.00",
          creditsCompleted: 0,
          creditsInProgress: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (student) {
    fetchGradesData();
  }
}, [student]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 ml-0"
      >
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 ml-0"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Grades</h1>

      {/* GPA Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Current GPA</div>
            <div className="stat-value">{gradesData.gpaSummary.current}</div>
            <div className="stat-desc">Based on completed courses</div>
          </div>
        </div>

        <div className="stats shadow bg-secondary text-secondary-content">
          <div className="stat">
            <div className="stat-title">Cumulative GPA</div>
            <div className="stat-value">{gradesData.gpaSummary.cumulative}</div>
            <div className="stat-desc">All semesters</div>
          </div>
        </div>

        <div className="stats shadow bg-accent text-accent-content">
          <div className="stat">
            <div className="stat-title">Credits Completed</div>
            <div className="stat-value">{gradesData.gpaSummary.creditsCompleted}</div>
            <div className="stat-desc">Total credit hours</div>
          </div>
        </div>

        <div className="stats shadow bg-base-200">
          <div className="stat">
            <div className="stat-title">Credits In Progress</div>
            <div className="stat-value">{gradesData.gpaSummary.creditsInProgress}</div>
            <div className="stat-desc">Current semester</div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div className="card bg-base-200 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Current Courses</h2>
          {gradesData.currentGrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesData.currentGrades.map((course, index) => (
                    <tr key={index}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.credits}</td>
                      <td>
                        <span className="badge badge-info">In Progress</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4">No current courses</p>
          )}
        </div>
      </div>

      {/* Completed Courses */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Completed Courses</h2>
          {gradesData.completedGrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesData.completedGrades.map((course, index) => (
                    <tr key={index}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.credits}</td>
                      <td>
                        <span className={`badge ${
                          course.grade === 'A' ? 'badge-success' :
                          course.grade === 'B' ? 'badge-primary' :
                          course.grade === 'C' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4">No completed courses</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Grades;