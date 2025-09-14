import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../App';
import { setAllReview } from '../redux/reviewSlice';
import axios from 'axios';

// Renamed to useAllReviews to follow React Hook conventions
const useAllReviews = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/review/allReview", { withCredentials: true });
                dispatch(setAllReview(result.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllReviews();
    }, [dispatch]); // Added dispatch to dependency array
};

export default useAllReviews;
