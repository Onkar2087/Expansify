import { genToken } from "../configs/token.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendMail from "../configs/Mail.js";

export const signUp = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;
        let existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid Email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Please enter a Strong Password" });
        }

        let hashPassword = await bcrypt.hash(password, 10);
        let newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role,
        });

        let token = await genToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // --- FIX APPLIED HERE ---
        // Convert the Mongoose document to a plain object and remove the password
        const userObject = newUser.toObject();
        delete userObject.password;

        return res.status(201).json(userObject);

    } catch (error) {
        console.log("signUp error", error);
        return res.status(500).json({ message: `signUp Error: ${error.message}` });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        // --- FIX APPLIED HERE ---
        // Find the user but exclude the password field from the document
        let user = await User.findOne({ email }).select("+password"); // Temporarily include password for comparison

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        const userObject = user.toObject();
        delete userObject.password;

        return res.status(200).json(userObject);

    } catch (error) {
        console.log("login error", error);
        return res.status(500).json({ message: `login Error: ${error.message}` });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        return res.status(500).json({ message: `logout Error: ${error.message}` });
    }
};

export const googleSignup = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        let user = await User.findOne({ email }).select("-password");

        if (!user) {
            // Create a new user if they don't exist
            const newUser = await User.create({ name, email, role });
            user = newUser.toObject();
            delete user.password;
        }

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `googleSignup Error: ${error.message}` });
    }
};

// --- No changes needed for OTP and password reset as they don't return user data ---

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.isOtpVerifed = false;

        await user.save();
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: `send otp error: ${error.message}` });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.isOtpVerifed = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Verify otp error: ${error.message}` });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerifed) {
            return res.status(400).json({ message: "Please verify OTP first" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.isOtpVerifed = false; // Reset verification status
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Reset Password error: ${error.message}` });
    }
};
