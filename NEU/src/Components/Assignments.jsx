import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Assignments = () => {
  const { student } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/students/assignments`);
        setAssignments(response);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchAssignments();
    }
  }, [student]);

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'All') return true;
    return assignment.status === activeTab;
  });

  const handleSubmit = async () => {
    if (!submissionLink) {
      toast.error('Please enter a submission link');
      return;
    }

    try {
      await api.put(`/api/students/assignments/${selectedAssignment.student_assignment_id}/submit`, {
        submissionLink
      });

      const updatedAssignments = assignments.map(assignment => {
        if (assignment.student_assignment_id === selectedAssignment.student_assignment_id) {
          return {
            ...assignment,
            status: 'Submitted',
            submission_date: new Date().toISOString(),
            file_path: submissionLink
          };
        }
        return assignment;
      });

      setAssignments(updatedAssignments);
      setIsModalOpen(false);
      setSubmissionLink('');
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Assignments</h1>

      {/* Assignment Tabs */}
      <div className="tabs mb-6">
        {['All', 'Pending', 'Submitted', 'Graded'].map((tab) => (
          <button
            key={tab}
            className={`tab tab-bordered ${activeTab === tab ? 'tab-active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="alert alert-info">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No {activeTab.toLowerCase()} assignments found</span>
            </div>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.student_assignment_id} className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h2 className="card-title">
                      {assignment.course_code}: {assignment.title}
                      <span className={`ml-2 badge ${
                        assignment.status === 'Pending' ? 'badge-warning' : 
                        assignment.status === 'Submitted' ? 'badge-info' : 'badge-success'
                      }`}>
                        {assignment.status}
                      </span>
                    </h2>
                    <p className="text-sm opacity-80">{assignment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                    {assignment.submission_date && (
                      <p className="text-sm">Submitted: {new Date(assignment.submission_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                {assignment.status !== 'Pending' && (
                  <div className="mt-4 pt-4 border-t border-base-300">
                    {assignment.score && (
                      <p className="font-medium">Score: {assignment.score}</p>
                    )}
                    {assignment.feedback && (
                      <div className="mt-2">
                        <p className="font-medium">Feedback:</p>
                        <p className="text-sm">{assignment.feedback}</p>
                      </div>
                    )}
                    {assignment.file_path && (
                      <div className="mt-2">
                        <p className="font-medium">Submission:</p>
                        <a 
                          href={assignment.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm link link-primary"
                        >
                          View Submission
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
                  {assignment.status === 'Pending' ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsModalOpen(true);
                      }}
                    >
                      Submit
                    </button>
                  ) : (
                    <button className="btn btn-ghost btn-sm">View Details</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Submit Assignment</h3>
            <p className="py-4">
              Submit your work for: <strong>{selectedAssignment?.title}</strong>
            </p>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Submission Link (Google Drive, etc.)</span>
              </label>
              <input
                type="text"
                placeholder="Paste your submission link here"
                className="input input-bordered w-full"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Assignments;