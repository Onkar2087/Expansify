import Course from "../models/courseModel.js";
import razorpay from 'razorpay';
import User from "../models/userModel.js";
import dotenv from "dotenv";
import crypto from "crypto"; // 1. Import the crypto module

dotenv.config();

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const options = {
            amount: course.price * 100, // amount in the smallest currency unit (paisa)
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`, // Use a more unique receipt
        };

        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json(order);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Order creation failed: ${err.message}` });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        // 2. Get all required fields from the request body
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;

        // This is the crucial part for security
        // 3. Create the HMAC signature on the backend
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        // 4. Compare the generated signature with the one from the client
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is authentic and verified. Now, enroll the user.
            // We don't need to call razorpayInstance.orders.fetch anymore.
            // The signature verification is sufficient proof of a successful payment.

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!user.enrolledCourses.includes(courseId)) {
                user.enrolledCourses.push(courseId);
                await user.save();
            }

            const course = await Course.findById(courseId);
             if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            if (!course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId);
                await course.save();
            }

            // You might also want to save the order details to your own 'Order' model here
            // For record-keeping.

            return res.status(200).json({ message: "Payment verified and enrollment successful" });
        } else {
            // If signatures do not match, the request is fraudulent.
            return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error during payment verification" });
    }
};
