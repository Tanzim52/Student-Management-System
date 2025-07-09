import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { student, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api.get("/api/students/profile");
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
    setActiveSubmenu(null);
  }, [location.pathname, isAuthenticated]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      path: "/",
    },
    {
      name: "Profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: "profile",
    },
    {
      name: "Courses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      path: "courses",
    },
    {
      name: "Grades",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: "grades",
    },
    {
      name: "Assignments",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: "assignments",
    },
    {
      name: "Attendance",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: "/attendance",
    },
    {
      name: "Announcements",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      path: "/announcements",
    },
  ];

  const sidebarVariants = {
    open: { width: "280px" },
    closed: { width: "80px" },
  };

  const linkVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      className={`flex flex-col h-screen bg-base-200 text-base-content shadow-lg fixed z-10`}
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {isOpen ? (
          <motion.h1 className="text-xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Student Portal
          </motion.h1>
        ) : (
          <motion.h1 className="text-xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            SP
          </motion.h1>
        )}
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-circle"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <ul className="menu space-y-2">
          {menuItems.map((item) => (
            <li key={item.name} className="relative">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-base-300"
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && (
                  <motion.span
                    className="ml-3 whitespace-nowrap"
                    initial="open"
                    animate={isOpen ? "open" : "closed"}
                    variants={linkVariants}
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-base-300">
        {!isAuthenticated ? (
          <div className="flex justify-center">
            <span className="text-sm opacity-70">Please log in</span>
          </div>
        ) : loading ? (
          <div className="flex items-center space-x-3">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            {isOpen && (
              <div className="space-y-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-3 w-16"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={userData?.profile_image_url || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                    alt="User avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";
                    }}
                  />
                </div>
              </div>
              {isOpen && (
                <motion.div
                  className="ml-3"
                  initial="open"
                  animate={isOpen ? "open" : "closed"}
                  variants={linkVariants}
                >
                  <p className="font-medium">
                    {userData?.first_name} {userData?.last_name}
                  </p>
                  <p className="text-sm opacity-70">{userData?.department_name}</p>
                </motion.div>
              )}
            </div>

            {isAuthenticated && (
              <motion.div
                initial="open"
                animate={isOpen ? "open" : "closed"}
                variants={linkVariants}
              >
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  aria-label="Logout"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;