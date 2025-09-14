Expansify - AI-Powered Learning Management System
Expansify is a modern, full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express.js, React, Node.js) and enhanced with AI-powered features. It provides a seamless and interactive platform for educators to create and manage courses, and for students to enroll, learn, and grow their skills.

📋 Table of Contents
About The Project

Key Features

Technology Stack

Getting Started

Prerequisites

Backend Setup

Frontend Setup

Environment Variables

API Endpoints

Project Structure

Screenshots

License

<a name="about-the-project"></a> 📖 About The Project
Expansify was built to provide a modern, intuitive, and feature-rich online learning experience. Unlike traditional platforms, it integrates AI to help students discover relevant courses based on natural language queries. The platform is designed with two primary user roles in mind: Educators, who can build their brand and monetize their knowledge, and Students, who can explore a wide range of courses and learn at their own pace.

The entire application is built from the ground up, featuring a secure RESTful API on the backend and a dynamic, responsive user interface on the frontend powered by React and Redux for state management.

<a name="-key-features"></a> ✨ Key Features
👤 Role-Based Authentication: Secure JWT (JSON Web Token) authentication with distinct roles for "Student" and "Educator".

💳 Secure Payments: Integrated with Razorpay for seamless and secure course enrollments, including signature verification to prevent fraud.

🤖 AI-Powered Search: Utilizes the Google Gemini AI to understand natural language queries and recommend the most relevant course categories.

🗣️ Voice-Enabled Search: Users can search for courses using their voice, powered by the Web Speech API.

🔐 Social & Manual Login: Supports both traditional email/password signup and one-click Google OAuth 2.0 authentication via Firebase.

Course Management (Educator):

Create, edit, and delete courses.

Upload course thumbnails and video lectures to Cloudinary.

Publish/unpublish courses.

View an analytics dashboard with total earnings, enrollment numbers, and course progress charts.

Learning Experience (Student):

Browse and filter published courses by category.

View course details, curriculum, and free preview lectures.

Enroll in courses via secure payment.

Watch lectures in a dedicated video player.

Submit ratings and reviews for courses.

💅 Modern UI & State Management:

Responsive design built with Tailwind CSS.

Centralized state management using Redux Toolkit.

Real-time UI updates and notifications with React Toastify.

<a name="-technology-stack"></a> 💻 Technology Stack
Backend

Frontend

Node.js

React.js 19

Express.js

React Router v7

MongoDB with Mongoose

Redux Toolkit

JSON Web Token (JWT)

Tailwind CSS

Cloudinary (File Storage)

Axios (HTTP Requests)

Razorpay API (Payments)

Firebase (Google Auth)

Nodemailer (Email/OTP)

Recharts (Dashboard Charts)

Google Generative AI (Gemini)

React Icons, React Spinners

Multer (File Upload Handling)

Vite (Build Tool)

<a name="-getting-started"></a> 🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Make sure you have the following installed on your machine:

Node.js (v18 or higher)

npm

MongoDB (or a MongoDB Atlas account)

<a name="-backend-setup"></a> 🔧 Backend Setup
Clone the repository

git clone [https://github.com/your-username/expansify-lms.git](https://github.com/your-username/expansify-lms.git)

Navigate to the backend directory

cd expansify-lms/backend

Install NPM packages

npm install

Create a .env file in the backend root and add the required environment variables. See the Environment Variables section below for the template.

Run the server

npm run dev

The backend server will start on the port you specified in your .env file (e.g., http://localhost:8000).

<a name="-frontend-setup"></a> 🖥️ Frontend Setup
Navigate to the frontend directory

cd ../frontend

Install NPM packages

npm install

Create a .env file in the frontend root for your Firebase and Razorpay keys. See the Environment Variables section below.

Run the React development server

npm run dev

The application will be available at http://localhost:5173.

<a name="-environment-variables"></a> 🔑 Environment Variables
You will need to create a .env file in both the backend and frontend directories.

Backend .env file:

# Server Configuration
PORT=8000

# MongoDB Connection
MONGODB_URL=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key

# Nodemailer (Gmail) Credentials
EMAIL=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key

Frontend .env file:

# Firebase Configuration
VITE_FIREBASE_APIKEY=your_firebase_api_key

# Razorpay Key ID (for frontend checkout)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

<a name="-api-endpoints"></a> 🌐 API Endpoints
The backend provides the following RESTful API routes:

Method

Endpoint

Description

Protected

POST

/api/auth/signup

Register a new user.

No

POST

/api/auth/login

Log in an existing user.

No

GET

/api/auth/logout

Log out the current user.

No

GET

/api/user/currentuser

Get details of the logged-in user.

Yes

POST

/api/user/updateprofile

Update user's profile information.

Yes

GET

/api/course/getpublishedcourses

Get all published courses.

No

POST

/api/course/create

Create a new course (Educator only).

Yes

DELETE

/api/course/removecourse/:id

Delete a course (Educator only).

Yes

POST

/api/payment/create-order

Create a Razorpay order for enrollment.

Yes

POST

/api/payment/verify-payment

Verify the payment signature.

Yes

POST

/api/ai/search

Search for courses using AI.

Yes

POST

/api/review/givereview

Add a review to a course.

Yes

<a name="-project-structure"></a> 📁 Project Structure
The project is organized into backend and frontend directories with a modular structure.

expansify-lms/
├── backend/
│   ├── config/           # Database, Cloudinary, Mailer configs
│   ├── controllers/      # Route handling logic
│   ├── middlewares/      # Authentication, file upload handling
│   ├── models/           # Mongoose schemas
│   ├── public/           # Temporary storage for uploads
│   ├── routes/           # Express API routes
│   └── index.js          # Main server entry point
└── frontend/
    ├── src/
    │   ├── assets/         # Images, videos, static files
    │   ├── components/     # Reusable React components
    │   ├── customHooks/    # Custom data-fetching hooks
    │   ├── pages/          # Page-level components
    │   ├── redux/          # Redux Toolkit store, slices
    │   ├── utils/          # Firebase config
    │   ├── App.jsx         # Main component with routing
    │   └── main.jsx        # Application entry point
    └── package.json

<a name="-screenshots"></a> 🖼️ Screenshots
Homepage showcasing popular courses and categories.

Educator dashboard with analytics on student enrollment and course progress.

AI-powered search interface allowing users to find courses with natural language.

The student's lecture view, providing a focused learning experience.

<a name="-license"></a> 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.