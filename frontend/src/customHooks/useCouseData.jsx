import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setCourseData } from '../redux/courseSlice.js';
import { useEffect } from 'react';

// Renamed to useCourseData (and fixed typo) to follow React Hook conventions
const useCourseData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllPublishedCourse = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublishedcoures", { withCredentials: true });
        dispatch(setCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    getAllPublishedCourse();
  }, [dispatch]); // Added dispatch to dependency array
};

export default useCourseData;
