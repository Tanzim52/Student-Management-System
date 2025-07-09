import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { student } = useAuth();
  const [attendanceSummary, setAttendanceSummary] = useState({
    overall: "0%",
    byCourse: []
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyAbsences, setShowOnlyAbsences] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        
        // Fetch summary and records in parallel
        const [summaryRes, recordsRes] = await Promise.all([
          api.get('/api/students/attendance/summary'),
          api.get('/api/students/attendance/records')
        ]);

        setAttendanceSummary(summaryRes);
        setAttendanceRecords(recordsRes);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchAttendanceData();
    }
  }, [student]);

  const filteredRecords = showOnlyAbsences
    ? attendanceRecords.filter(record => record.status === 'Absent')
    : attendanceRecords;

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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Attendance</h1>

      {/* Attendance Summary */}
      <div className="card bg-base-200 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Overall Attendance</div>
                <div className="stat-value">{attendanceSummary.overall}</div>
                <div className="stat-desc">Last 30 days</div>
              </div>
            </div>

            {attendanceSummary.byCourse.map((course, index) => (
              <div key={index} className="stats shadow">
                <div className="stat">
                  <div className="stat-title">{course.course}</div>
                  <div className="stat-value">{course.percentage}</div>
                  <div className="stat-desc">
                    {course.present + (course.late || 0)}/{course.total} classes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Recent Records</h2>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Show only absences</span> 
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={showOnlyAbsences}
                  onChange={() => setShowOnlyAbsences(!showOnlyAbsences)}
                />
              </label>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.course}</td>
                      <td>{record.time}</td>
                      <td>
                        <span className={`badge ${
                          record.status === 'Present' ? 'badge-success' :
                          record.status === 'Late' ? 'badge-warning' : 'badge-error'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.remarks || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      {showOnlyAbsences 
                        ? "No absence records found" 
                        : "No attendance records found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Attendance;