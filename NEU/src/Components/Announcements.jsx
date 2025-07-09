import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Announcements = () => {
  const { student } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/announcements');
        setAnnouncements(response);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchAnnouncements();
    }
  }, [student]);

  const filterOptions = ['All', 'General', 'Department', 'Registration', 'Events'];

  const filteredAnnouncements = announcements.filter(announcement => {
    if (activeFilter === 'All') return true;
    return announcement.category === activeFilter;
  });

  const getBadgeColor = (category) => {
    switch(category) {
      case 'General': return 'badge-info';
      case 'Department': return 'badge-primary';
      case 'Registration': return 'badge-secondary';
      case 'Events': return 'badge-accent';
      default: return 'badge-ghost';
    }
  };

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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Announcements</h1>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            className={`btn btn-sm ${activeFilter === filter ? 'btn-active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="alert alert-info">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No announcements found in this category</span>
            </div>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.announcement_id} 
              className={`card shadow-sm ${
                announcement.important ? 'border-l-4 border-warning' : ''
              }`}
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="card-title">
                    {announcement.title}
                    {announcement.important && (
                      <span className="badge badge-warning ml-2">Important</span>
                    )}
                  </h2>
                  <span className={`badge ${getBadgeColor(announcement.category)}`}>
                    {announcement.category}
                  </span>
                </div>
                
                <p className="mb-4 whitespace-pre-line">{announcement.content}</p>
                
                <div className="card-actions justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {announcement.target_department && (
                      <span className="badge badge-outline">
                        {announcement.department_name || 'Department'}
                      </span>
                    )}
                    <span className="text-sm opacity-70">
                      {new Date(announcement.publish_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Announcements;