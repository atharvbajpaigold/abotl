import React from 'react'
import { BrowserRouter as Router, Route,Routes, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Home from '../general/Home'
import TeacherSignup from '../general/TeacherSignup'
import StudentSignup from '../general/StudentSignup'
import TeacherLogin from '../general/TeacherLogin'
import StudentLogin from '../general/StudentLogin'
import StudentPage from '../general/StudentPage'
import TeacherPage from '../general/TeacherPage'
import StudentProfile from '../general/StudentProfile'
import TeacherProfile from '../general/TeacherProfile'
import Explore from '../general/Explore'
import Chat from '../general/Chat'
import Video from "../general/Video"

// helper: read role and user id from localStorage (httpOnly cookie cannot be read client-side)
const getAuthRole = () => {
  const role = localStorage.getItem('role');
  return role || null;
}

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?._id || user?.id || null;
  } catch (e) {
    return null;
  }
}

const RequireGuest = ({ children }) => {
  const role = getAuthRole();
  const id = getUserId();
  if (role === 'student') return <Navigate to={id ? `/student/page/${id}` : '/'} replace />;
  if (role === 'teacher') return <Navigate to={id ? `/teacher/page/${id}` : '/'} replace />;
  return children;
}

const RequireRolePage = ({ role, children }) => {
  const authRole = getAuthRole();
  // if not authenticated, redirect to home
  if (!authRole) return <Navigate to="/" replace />;
  // allow both authenticated users (no strict role check) or specific role
  if (role && authRole !== role) return <Navigate to="/" replace />;
  return children;
}

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={
              (() => {
                const role = getAuthRole();
                const id = getUserId();
                if (role === 'student') return <Navigate to={id ? `/student/page/${id}` : '/'} replace />;
                if (role === 'teacher') return <Navigate to={id ? `/teacher/page/${id}` : '/'} replace />;
                return <Home />;
              })()
            } />

            {/* Signup/Login routes should be inaccessible when already authenticated */}
            <Route path="/teacher/register" element={
              <RequireGuest>
                <TeacherSignup />
              </RequireGuest>
            } />

            <Route path="/student/register" element={
              <RequireGuest>
                <StudentSignup />
              </RequireGuest>
            } />

            <Route path="/teacher/login" element={
              <RequireGuest>
                <TeacherLogin />
              </RequireGuest>
            } />

            <Route path="/student/login" element={
              <RequireGuest>
                <StudentLogin />
              </RequireGuest>
            } />

            {/* Protected pages - expect an id param; allow access only if authenticated */}
            <Route path="/student/page/:id" element={
              <RequireRolePage role={'student'}>
                <StudentPage />
              </RequireRolePage>
            } />

            <Route path="/teacher/page/:id" element={
              <RequireRolePage role={'teacher'}>
                <TeacherPage />
              </RequireRolePage>
            } />

            {/* New protected routes: accessible to any authenticated user */}
            <Route path="/profile" element={
              <RequireRolePage>
                {(() => {
                  const role = getAuthRole();
                  return role === 'teacher' ? <TeacherProfile /> : <StudentProfile />;
                })()}
              </RequireRolePage>
            } />

            <Route path="/explore" element={
              <RequireRolePage>
                <Explore />
              </RequireRolePage>
            } />
            <Route path="/video" element={
              <RequireRolePage>
                <Video />
              </RequireRolePage>
            } />

            <Route path="/chat" element={
              <RequireRolePage>
                <Chat />
              </RequireRolePage>
            } />

            {/* fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
  )
}

export default AppRouter