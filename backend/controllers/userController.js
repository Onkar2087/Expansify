import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
    try {
        // This function was already correct, no changes needed here.
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Get current user error" });
    }
};

export const UpdateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description } = req.body;
        let updateData = { name, description };

        if (req.file) {
            const photoUrl = await uploadOnCloudinary(req.file.path);
            if (photoUrl) {
                updateData.photoUrl = photoUrl;
            }
        }

        // --- FIX APPLIED HERE ---
        // Use { new: true } to get the updated document back from the query
        // Chain .select("-password") to exclude the password from the result
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // The redundant `await user.save()` is removed as findByIdAndUpdate already saves.
        return res.status(200).json(updatedUser);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Update Profile Error: ${error.message}` });
    }
};
