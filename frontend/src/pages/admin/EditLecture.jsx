import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function EditLecture() {
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const { courseId, lectureId } = useParams();
    const { lectureData } = useSelector(state => state.lecture);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Find the lecture to edit from the Redux state
    const selectedLecture = lectureData.find(lecture => lecture._id === lectureId);

    // Initialize state with selected lecture's data, or empty strings if not found
    const [lectureTitle, setLectureTitle] = useState("");
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    
    // Effect to populate state once selectedLecture is available
    useEffect(() => {
        if (selectedLecture) {
            setLectureTitle(selectedLecture.lectureTitle || "");
            setIsPreviewFree(selectedLecture.isPreviewFree || false);
        }
    }, [selectedLecture]);


    const editLecture = async () => {
        if (!videoUrl) {
            toast.error("Please select a video file to upload.");
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append("lectureTitle", lectureTitle);
        formData.append("videoUrl", videoUrl);
        formData.append("isPreviewFree", isPreviewFree);

        try {
            const result = await axios.post(`${serverUrl}/api/course/editlecture/${lectureId}`, formData, { withCredentials: true });
            
            // --- FIX APPLIED HERE ---
            // Create a new array by mapping over the old one
            const updatedLectures = lectureData.map(lecture => {
                // If this is the lecture we just edited, return the updated version from the server
                if (lecture._id === lectureId) {
                    return result.data;
                }
                // Otherwise, return the lecture as it was
                return lecture;
            });

            // Dispatch the new, correctly updated array to Redux
            dispatch(setLectureData(updatedLectures));
            
            toast.success("Lecture Updated Successfully");
            navigate(`/createlecture/${courseId}`); // Navigate back to the lecture list

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update lecture.");
        } finally {
            setLoading(false);
        }
    };

    const removeLecture = async () => {
        setLoading1(true);
        try {
            await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, { withCredentials: true });

            // --- BEST PRACTICE FIX APPLIED HERE ---
            // Instead of just navigating, update the Redux state immediately for a better UX
            const updatedLectures = lectureData.filter(lecture => lecture._id !== lectureId);
            dispatch(setLectureData(updatedLectures));
            
            toast.success("Lecture Removed Successfully");
            navigate(`/createlecture/${courseId}`);

        } catch (error) {
            console.log(error);
            toast.error("Failed to remove lecture.");
        } finally {
            setLoading1(false);
        }
    };

    // If the user navigates directly to this page, selectedLecture might be undefined initially.
    // This prevents the app from crashing.
    if (!selectedLecture) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <ClipLoader size={50} color='black'/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <FaArrowLeft className="text-gray-600 cursor-pointer" onClick={() => navigate(`/createlecture/${courseId}`)} />
                    <h2 className="text-xl font-semibold text-gray-800">Update Your Lecture</h2>
                </div>
                <div>
                    <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm" disabled={loading1} onClick={removeLecture}>
                        {loading1 ? <ClipLoader size={20} color='white' /> : "Remove Lecture"}
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            placeholder="e.g., Introduction to React"
                            onChange={(e) => setLectureTitle(e.target.value)}
                            value={lectureTitle}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Video*</label>
                        <input
                            type="file"
                            required
                            accept='video/*'
                            className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-500"
                            onChange={(e) => setVideoUrl(e.target.files[0])}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isFree"
                            className="accent-black h-4 w-4"
                            checked={isPreviewFree} // Controlled component
                            onChange={() => setIsPreviewFree(prev => !prev)}
                        />
                        <label htmlFor="isFree" className="text-sm text-gray-700">Make this lecture a free preview</label>
                    </div>
                </div>
                <div>
                    {loading && <p className="text-sm text-gray-600">Uploading video... Please wait.</p>}
                </div>
                <div className="pt-4">
                    <button className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition" disabled={loading} onClick={editLecture}>
                        {loading ? <ClipLoader size={20} color='white' /> : "Update Lecture"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditLecture;
