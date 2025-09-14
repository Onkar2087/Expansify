import { GoogleGenerativeAI } from "@google/generative-ai"; // Correct package import
import dotenv from "dotenv";
import Course from "../models/courseModel.js";

dotenv.config();

// It's more efficient to initialize the client once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // --- 1. First, try a direct search on the user's input ---
        let courses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: input, $options: 'i' } },
                { subTitle: { $regex: input, $options: 'i' } },
                { description: { $regex: input, $options: 'i' } },
                { category: { $regex: input, $options: 'i' } },
                { level: { $regex: input, $options: 'i' } }
            ]
        });

        // --- 2. If the direct search yields results, return them immediately ---
        if (courses.length > 0) {
            return res.status(200).json(courses);
        }

        // --- 3. If no direct results, then use the AI to get a better keyword ---
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an intelligent assistant for an LMS platform. A user will type a query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list: App Development, AI/ML, AI Tools, Data Science, Data Analytics, Ethical Hacking, UI UX Designing, Web Development, Others, Beginner, Intermediate, Advanced. Only reply with one single keyword from the list. No extra text. Query: ${input}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const keyword = response.text().trim(); // Use trim() to remove any whitespace

        // --- 4. Search again using the AI-generated keyword ---
        const aiCourses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { subTitle: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
                { level: { $regex: keyword, $options: 'i' } }
            ]
        });

        return res.status(200).json(aiCourses);

    } catch (error) {
        // --- FIX APPLIED HERE ---
        // This now sends a proper error response back to the client
        console.error("AI Search Error:", error); // It's good practice to log the full error
        return res.status(500).json({ message: "An error occurred during the AI search." });
    }
};
