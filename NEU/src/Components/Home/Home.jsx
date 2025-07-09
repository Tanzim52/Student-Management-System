import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { student } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    currentCourses: [],
    upcomingAssignments: [],
    recentAnnouncements: [],
    attendanceSummary: { overall: '0%', recent: [] },
    gpa: { current: '0.00', creditsCompleted: 0 }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          coursesRes, 
          assignmentsRes, 
          announcementsRes, 
          attendanceRes, 
          gpaRes
        ] = await Promise.all([
          api.get('/api/students/courses'),
          api.get('/api/students/assignments?limit=3&status=Pending'),
          api.get('/api/announcements?limit=3'),
          api.get('/api/students/attendance/summary'),
          api.get('/api/students/grades-summary')
        ]);

        // Process courses data
        const currentCourses = (coursesRes.enrolled || []).slice(0, 3).map(course => ({
          id: course.course_id,
          code: course.code,
          title: course.title,
          instructor: course.instructor || 'Not assigned',
          time: course.semester_offered || 'Schedule not set'
        }));

        // Process assignments data
        const upcomingAssignments = (assignmentsRes || []).slice(0, 3).map(assignment => ({
          id: assignment.assignment_id,
          course: assignment.course_code,
          title: assignment.title,
          due: assignment.due_date,
          status: assignment.status
        }));

        // Process announcements data
        const recentAnnouncements = (announcementsRes || []).map(announcement => ({
          id: announcement.announcement_id,
          title: announcement.title,
          date: announcement.publish_date,
          preview: announcement.content?.substring(0, 100) + (announcement.content?.length > 100 ? '...' : ''),
          important: announcement.important
        }));

        // Process attendance data
        const attendanceSummary = {
          overall: attendanceRes.overall || '0%',
          recent: (attendanceRes.byCourse || []).slice(0, 2).map(course => ({
            course: course.course || 'Unknown Course',
            percentage: course.percentage,
            status: parseFloat(course.percentage) > 80 ? 'Present' : 'Needs Improvement'
          }))
        };

        // Process GPA data
        const gpa = {
          current: gpaRes.gpaSummary?.current || '0.00',
          creditsCompleted: gpaRes.gpaSummary?.creditsCompleted || 0
        };

        setDashboardData({
          currentCourses,
          upcomingAssignments,
          recentAnnouncements,
          attendanceSummary,
          gpa
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default/empty data on error
        setDashboardData({
          currentCourses: [],
          upcomingAssignments: [],
          recentAnnouncements: [],
          attendanceSummary: { overall: '0%', recent: [] },
          gpa: { current: '0.00', creditsCompleted: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchDashboardData();
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
        <div className="space-y-6">
          {/* Skeleton for header */}
          <div className="flex justify-between items-center">
            <div>
              <div className="skeleton h-8 w-64 mb-2"></div>
              <div className="skeleton h-4 w-48"></div>
            </div>
            <div className="skeleton h-6 w-24"></div>
          </div>

          {/* Skeleton for quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-sm">
                <div className="card-body p-4">
                  <div className="skeleton h-4 w-24 mb-2"></div>
                  <div className="skeleton h-8 w-16"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton for main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <div className="skeleton h-6 w-32"></div>
                    <div className="skeleton h-4 w-16"></div>
                  </div>
                  <div className="space-y-4">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="skeleton h-16 w-full rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {student?.first_name} {student?.last_name}
          </h1>
          <p className="text-sm md:text-base opacity-80">
            {student?.department_name || 'N/A'} • {student?.registration_number || 'N/A'}
          </p>
        </div>
        <div className={`badge ${
          student?.status === 'Active' ? 'badge-primary' : 
          student?.status === 'Inactive' ? 'badge-secondary' : 'badge-accent'
        } mt-2 md:mt-0`}>
          Status: {student?.status || 'Unknown'}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          whileHover={{ y: -3 }}
          className="card bg-base-200 shadow-sm"
        >
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Current GPA</h3>
            <p className="text-2xl font-bold">{dashboardData.gpa.current}</p>
            <p className="text-xs opacity-70">{dashboardData.gpa.creditsCompleted} credits completed</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="card bg-base-200 shadow-sm"
        >
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Enrolled Courses</h3>
            <p className="text-2xl font-bold">{dashboardData.currentCourses.length}</p>
            <p className="text-xs opacity-70">Current semester</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="card bg-base-200 shadow-sm"
        >
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Pending Assignments</h3>
            <p className="text-2xl font-bold">{dashboardData.upcomingAssignments.length}</p>
            <p className="text-xs opacity-70">Due soon</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="card bg-base-200 shadow-sm"
        >
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Attendance</h3>
            <p className="text-2xl font-bold">{dashboardData.attendanceSummary.overall}</p>
            <p className="text-xs opacity-70">Overall</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Courses */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Your Courses</h2>
              <Link to="/courses" className="link link-primary text-sm">View All</Link>
            </div>
            {dashboardData.currentCourses.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.currentCourses.map((course) => (
                  <Link 
                    key={course.id} 
                    to={`/courses/${course.id}`}
                    className="flex justify-between items-center p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{course.code}: {course.title}</h3>
                      <p className="text-sm opacity-70">{course.instructor}</p>
                    </div>
                    <span className="badge badge-ghost">{course.time}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm opacity-70">No courses enrolled</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Upcoming Assignments</h2>
              <Link to="/assignments" className="link link-primary text-sm">View All</Link>
            </div>
            {dashboardData.upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.upcomingAssignments.map((assignment) => (
                  <Link
                    key={assignment.id}
                    to={`/assignments/${assignment.id}`}
                    className="flex justify-between items-center p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{assignment.course}</h3>
                      <p className="text-sm">{assignment.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Due: {new Date(assignment.due).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <span className={`badge ${
                        assignment.status === 'Pending' ? 'badge-warning' : 
                        assignment.status === 'Submitted' ? 'badge-info' : 'badge-success'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm opacity-70">No upcoming assignments</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Announcements</h2>
              <Link to="/announcements" className="link link-primary text-sm">View All</Link>
            </div>
            {dashboardData.recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentAnnouncements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    to={`/announcements/${announcement.id}`}
                    className={`block p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors ${
                      announcement.important ? 'border-l-4 border-warning' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">
                        {announcement.title}
                        {announcement.important && (
                          <span className="badge badge-warning ml-2">Important</span>
                        )}
                      </h3>
                      <span className="text-sm opacity-70">
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{announcement.preview}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm opacity-70">No recent announcements</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Attendance Summary</h2>
              <Link to="/attendance" className="link link-primary text-sm">View Details</Link>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Overall: {dashboardData.attendanceSummary.overall}</h3>
              <progress 
                className="progress progress-primary w-full" 
                value={parseFloat(dashboardData.attendanceSummary.overall)} 
                max="100"
              ></progress>
            </div>
            {dashboardData.attendanceSummary.recent?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.attendanceSummary.recent.map((record, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                    <div>
                      <h3 className="font-medium">{record.course}</h3>
                      <p className="text-sm opacity-70">{record.percentage}</p>
                    </div>
                    <span className={`badge ${
                      record.status === 'Present' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm opacity-70">No recent attendance records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;