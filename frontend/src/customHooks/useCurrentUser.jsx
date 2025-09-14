import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

// Renamed to useCurrentUser to follow React Hook conventions
const useCurrentUser = () => {
    let dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
                dispatch(setUserData(result.data));
            } catch (error) {
                console.log("No authenticated user found or session expired.");
                dispatch(setUserData(null));
            }
        };
        fetchUser();
    }, [dispatch]); // Added dispatch to dependency array as per ESLint best practices
};

export default useCurrentUser;
