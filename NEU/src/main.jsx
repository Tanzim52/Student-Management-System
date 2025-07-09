import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import './index.css'
import Root from './Components/Root';
import Home from './Components/Home/Home';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ErrorPage from './Components/ErrorPage';
import Profile from './Components/Profile';
import Grades from './Components/Grades';
import Assignments from './Components/Assignments';
import Attendance from './Components/Attendance';
import Announcements from './Components/Announcements';
import Courses from './Components/Courses';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Root />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 5000
            }
          }}
        />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Signup />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            index: true,  // This replaces path: "/"
            element: <Home />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "grades",
            element: <Grades />
          },
          {
            path: "assignments",
            element: <Assignments />
          },
          {
            path: "attendance",
            element: <Attendance />
          },
          {
            path: "announcements",
            element: <Announcements />
          },
          {
            path: "courses",
            element: <Courses />
          },
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)