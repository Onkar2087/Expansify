import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: `Expanify Team <${process.env.EMAIL}>`,
            to: to,
            subject: "Your Password Reset Code - Expanify",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Expanify</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1a202c 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Expanify</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0; font-size: 16px;">Expand Your Learning Journey</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
                We received a request to reset your password for your Expanify account. 
                Use the verification code below to complete the process.
            </p>
            
            <!-- OTP Box -->
            <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 20px; margin: 30px 0; text-align: center;">
                <p style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 500;">Your verification code:</p>
                <div style="font-size: 32px; letter-spacing: 8px; color: #2b6cb0; font-weight: 700; padding: 15px; background-color: #ebf4ff; border-radius: 8px; display: inline-block;">
                    ${otp}
                </div>
            </div>
            
            <p style="color: #718096; line-height: 1.6; margin-bottom: 20px;">
                This code will expire in <strong style="color: #e53e3e;">5 minutes</strong> for security reasons.
                If you didn't request this password reset, please ignore this email or contact our support team 
                if you have concerns about your account security.
            </p>
            
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                    <strong>Need help?</strong> Contact our support team at 
                    <a href="mailto:support@expanify.com" style="color: #4299e1; text-decoration: none;">support@expanify.com</a> 
                    or visit our 
                    <a href="https://expanify.com/help" style="color: #4299e1; text-decoration: none;">Help Center</a>.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #edf2f7; padding: 25px 30px; text-align: center;">
            <p style="color: #718096; margin: 0 0 15px; font-size: 14px;">
                &copy; ${new Date().getFullYear()} Expanify Learning Platform. All rights reserved.
            </p>
            <div style="margin-bottom: 15px;">
                <a href="https://expanify.com" style="color: #4a5568; text-decoration: none; margin: 0 12px; font-size: 14px;">Website</a>
                <a href="https://expanify.com/privacy" style="color: #4a5568; text-decoration: none; margin: 0 12px; font-size: 14px;">Privacy Policy</a>
                <a href="https://expanify.com/terms" style="color: #4a5568; text-decoration: none; margin: 0 12px; font-size: 14px;">Terms of Service</a>
            </div>
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                This email was sent to ${to}. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>
            `
        });
        console.log("OTP email sent successfully to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send OTP email.");
    }
};

export default sendMail;