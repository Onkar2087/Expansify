import { useEffect } from 'react';
import { serverUrl } from '../App';
import axios from 'axios';
import { setCreatorCourseData } from '../redux/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Renamed to useCreatorCourseData to follow React Hook conventions
const useCreatorCourseData = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    // Removed the incorrect `return` statement. Hooks should not return JSX.
    useEffect(() => {
        // Only fetch creator data if the user is logged in and is an educator
        if (userData && userData.role === 'educator') {
            const getCreatorData = async () => {
                try {
                    const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true });
                    dispatch(setCreatorCourseData(result.data));
                } catch (error) {
                    console.log(error);
                    // Avoid showing a toast if the user is not an educator or not logged in
                    if (error.response?.data?.message) {
                       toast.error(error.response.data.message);
                    }
                }
            };
            getCreatorData();
        } else {
            // If user is not an educator, clear any existing creator course data
            dispatch(setCreatorCourseData([]));
        }
    }, [userData, dispatch]); // Effect now depends on userData and dispatch
};

export default useCreatorCourseData;
