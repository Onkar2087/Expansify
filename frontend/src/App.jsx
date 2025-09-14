import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import ForgotPassword from './pages/ForgotPassword';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/admin/Dashboard';
import Courses from './pages/admin/Courses';
// Fixed typo from AllCouses
import AddCourses from './pages/admin/AddCourses';
import CreateCourse from './pages/admin/CreateCourse';
import CreateLecture from './pages/admin/CreateLecture';
import EditLecture from './pages/admin/EditLecture';
import ViewCourse from './pages/ViewCourse';
import ScrollToTop from './components/ScrollToTop';
import EnrolledCourse from './pages/EnrolledCourse';
import ViewLecture from './pages/ViewLecture';
import SearchWithAi from './pages/SearchWithAi';

// 1. Import the renamed custom hooks
import useCurrentUser from './customHooks/useCurrentUser';

import useCreatorCourseData from './customHooks/useCreatorCourseData';
import useAllReviews from './customHooks/useAllReviews';
import AllCourses from './pages/AllCouses';
import useCourseData from './customHooks/useCouseData';

// For production
export const serverUrl = import.meta.env.PROD 
    ? "https://expanify-backend.vercel.app" 
    : "http://localhost:8000";

function App() {
    const { userData } = useSelector(state => state.user);

    // 2. Call the hooks at the top level of the component.
    // Their internal useEffect will ensure they only run once on mount.
    useCurrentUser();
    useCourseData()
    useCreatorCourseData();
    useAllReviews();

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ScrollToTop />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
                <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
                <Route path='/forgotpassword' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

                {/* Protected Routes for any logged-in user */}
                <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
                <Route path='/allcourses' element={userData ? <AllCourses/> : <Navigate to="/login" />} />
                <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to="/login" />} />
                <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to="/login" />} />
                <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to="/login" />} />
                <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to="/login" />} />
                <Route path='/searchwithai' element={userData ? <SearchWithAi /> : <Navigate to="/login" />} />

                {/* Protected Routes for Educators only */}
                <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/" />} />
                <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to="/" />} />
                <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to="/" />} />
                <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to="/" />} />
                <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/" />} />
                <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
