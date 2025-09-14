import uploadOnCloudinary from "../configs/cloudinary.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Review from "../models/reviewModel.js"; // Import Review model
import User from "../models/userModel.js";

// create Courses
export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId,
        });

        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to create course: ${error.message}` });
    }
};

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures reviews");
        if (!courses) {
            return res.status(404).json({ message: "Courses not found" });
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get all courses: ${error.message}` });
    }
};

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({ message: "Courses not found" });
        }
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator courses: ${error.message}` });
    }
};

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, subTitle, description, category, level, price, isPublished } = req.body;
        
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Only update fields that are actually provided
        const updateData = { title, subTitle, description, category, level, price, isPublished };

        if (req.file) {
            const thumbnail = await uploadOnCloudinary(req.file.path);
            updateData.thumbnail = thumbnail;
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json(updatedCourse); // Use 200 for update
    } catch (error) {
        return res.status(500).json({ message: `Failed to update course: ${error.message}` });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get course: ${error.message}` });
    }
};

export const removeCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // --- FIX APPLIED HERE ---
        // 1. Delete all lectures associated with the course to prevent orphans
        await Lecture.deleteMany({ _id: { $in: course.lectures } });

        // 2. Delete all reviews associated with the course
        await Review.deleteMany({ _id: { $in: course.reviews } });
        
        // 3. (Optional but good practice) Pull this course from all users' enrolledCourses array
        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );

        // 4. Now, it's safe to delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: "Course and all associated data removed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Failed to remove course: ${error.message}` });
    }
};

// --- LECTURE CONTROLLERS ---

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "Lecture Title and Course ID are required" });
        }
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
            await course.populate("lectures");
            return res.status(201).json({ lecture, course });
        } else {
            return res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: `Failed to Create Lecture: ${error.message}` });
    }
};

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Lectures: ${error.message}` });
    }
};

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { isPreviewFree, lectureTitle } = req.body;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        if (req.file) {
            const videoUrl = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = videoUrl;
        }
        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle;
        }
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();
        return res.status(200).json(lecture);
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Lectures: ${error.message}` });
    }
};

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        // Remove the lecture reference from the associated course
        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );
        return res.status(200).json({ message: "Lecture Removed Successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Failed to remove Lectures: ${error.message}` });
    }
};

// --- CREATOR CONTROLLER ---

export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: `Get Creator error: ${error.message}` });
    }
};
