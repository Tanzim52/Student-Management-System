import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { student: authStudent, isLoading: authLoading } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // Fetch profile data
        const profile = await api.get('/api/students/profile');
        setStudentData({
          ...profile,
          firstName: profile.first_name,
          lastName: profile.last_name,
          department: profile.department_name,
          department_id: profile.department_id,
          profileImageUrl: profile.profile_image_url,
          registrationNumber: profile.registration_number // Add this line
        });
        
        // Fetch departments list
        const depts = await api.get('/api/departments');
        setDepartments(depts.map(d => d.name));
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (authStudent && !authLoading) {
      fetchProfileData();
    }
  }, [authStudent, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.put('/api/students/profile', {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        phone: studentData.phone,
        address: studentData.address,
        city: studentData.city,
        state: studentData.state,
        zip_code: studentData.zip_code,
        country: studentData.country,
        dob: studentData.dob,
        gender: studentData.gender,
        department_id: departments.findIndex(d => d === studentData.department) + 1,
        profileImageUrl: studentData.profileImageUrl,
        registrationNumber: studentData.registrationNumber // Add this line
      });
      
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 ml-0 flex justify-center items-center h-64"
      >
        <span className="loading loading-spinner loading-lg"></span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 ml-0"
      >
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </motion.div>
    );
  }

  if (!studentData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 ml-0"
      >
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>No profile data available</span>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Student Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Edit Profile'}
          </button>
        ) : (
          <div className="space-x-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full bg-base-300">
                  <img 
                    src={studentData.profileImageUrl || 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'} 
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
              </div>
              {isEditing && (
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Profile Image URL</span>
                  </label>
                  <input
                    type="url"
                    name="profileImageUrl"
                    value={studentData.profileImageUrl || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Paste hosted image link"
                  />
                  <label className="label">
                    <span className="label-text-alt">Upload to ImgBB and paste the link</span>
                  </label>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="flex-1">
              {isEditing ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Name</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={studentData.firstName}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last Name</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={studentData.lastName}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Registration Number</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={studentData.registrationNumber || ''}
                      onChange={handleChange}
                      className="input input-bordered"
                      disabled
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={studentData.email}
                      onChange={handleChange}
                      className="input input-bordered"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={studentData.phone || ''}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date of Birth</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={studentData.dob || ''}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={studentData.address || ''}
                      onChange={handleChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">City</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={studentData.city || ''}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">State</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={studentData.state || ''}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">ZIP Code</span>
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={studentData.zip_code || ''}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Country</span>
                      </label>
                      <select
                        name="country"
                        value={studentData.country || 'Bangladesh'}
                        onChange={handleChange}
                        className="select select-bordered"
                      >
                        <option>Bangladesh</option>
                        <option disabled>Other countries (disabled for demo)</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Gender</span>
                      </label>
                      <select
                        name="gender"
                        value={studentData.gender || ''}
                        onChange={handleChange}
                        className="select select-bordered"
                      >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Department</span>
                    </label>
                    <select
                      name="department"
                      value={studentData.department || ''}
                      onChange={handleChange}
                      className="select select-bordered"
                      disabled={!isEditing}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm opacity-70">First Name</h3>
                      <p className="text-lg">{studentData.firstName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm opacity-70">Last Name</h3>
                      <p className="text-lg">{studentData.lastName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm opacity-70">Registration Number</h3>
                    <p className="text-lg">{studentData.registrationNumber || 'Not available'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm opacity-70">Email</h3>
                    <p className="text-lg">{studentData.email}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm opacity-70">Phone</h3>
                      <p className="text-lg">{studentData.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm opacity-70">Date of Birth</h3>
                      <p className="text-lg">{studentData.dob || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm opacity-70">Address</h3>
                    <p className="text-lg">{studentData.address || 'Not provided'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm opacity-70">City</h3>
                      <p className="text-lg">{studentData.city || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm opacity-70">State</h3>
                      <p className="text-lg">{studentData.state || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm opacity-70">ZIP Code</h3>
                      <p className="text-lg">{studentData.zip_code || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm opacity-70">Country</h3>
                      <p className="text-lg">{studentData.country || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm opacity-70">Gender</h3>
                      <p className="text-lg">{studentData.gender || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm opacity-70">Department</h3>
                    <p className="text-lg">{studentData.department || 'Not assigned'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm opacity-70">Enrollment Date</h3>
                    <p className="text-lg">{studentData.enrollment_date || 'Not available'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm opacity-70">Status</h3>
                    <p className="text-lg">{studentData.status || 'Unknown'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;