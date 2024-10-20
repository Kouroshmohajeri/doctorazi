import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import clinicalRecordRoutes from "./src/routes/clinicalRecordRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import specialityRoutes from "./src/routes/specialityRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import zoomMeetingsRoutes from "./src/routes/zoomMeetingsRoutes.js";
import zoomRoutes from "./src/routes/zoomRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import recordsRoutes from "./src/routes/recordsRoutes.js";
import downloaderRoutes from "./src/routes/downloaderRoutes.js";
import calendarRoutes from "./src/routes/calendarRoutes.js";
import axios from "axios";
import oauthRefreshTokenRoutes from "./src/routes/oauthRefreshTokenRoutes.js";
import prescriptionRoutes from "./src/routes/prescriptionRoutes.js";
import facilityRoutes from "./src/routes/facilityRoutes.js";
import biographyRoutes from "./src/routes/biographyRoutes.js";
import profileImageRoutes from "./src/routes/profileImageRoutes.js";
import blogPostRoutes from "./src/routes/blogPostRoutes.js";
import authorRoutes from "./src/routes/authorRoutes.js";
import blogImageRouter from "./src/routes/blogImageRouter.js";
import translatorRoutes from "./src/routes/translatorRoutes.js";
import translationsRoutes from "./src/routes/translationsRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import documentRouter from "./src/routes/documentRouter.js";
import { pool } from "./src/config/db.js";
import { decryptPayload } from "./src/utils/encryption.js";
import jwt from "jsonwebtoken";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: "http://doctorazi.com", // Your frontend domain
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON requests
app.use(express.static("src/public"));

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clinicalRecords", clinicalRecordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/specialities", specialityRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/zoomMeetings", zoomMeetingsRoutes);
app.use("/api/zoom", zoomRoutes);
app.use("/api/oauthRefresh", oauthRefreshTokenRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/download", downloaderRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/biography", biographyRoutes);
app.use("/api/profileImage", profileImageRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/blogPost", blogPostRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/blogImages", blogImageRouter);
app.use("/api/translators", translatorRoutes);
app.use("/api/translations", translationsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/documents", documentRouter);

// Test MySQL connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connection established successfully.");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err);
  });

// OAuth Redirect URI route
app.get("/oauth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.log(req.query);
    return res.status(400).json({ error: `Missing authorization code` });
  }

  try {
    // Exchange the authorization code for tokens
    const authResponse = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:8800/oauth/callback", // This should match the redirect_uri in your OAuth URL
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token, expires_in } = authResponse.data;

    // Here you might want to save the tokens and expiry time to your database or some storage for later use

    // Respond with the tokens (or you can redirect the user to another page of your application)
    res.json({ access_token, refresh_token, expires_in });
  } catch (error) {
    console.error(
      "Error exchanging authorization code for tokens:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to exchange authorization code for tokens" });
  }
});

// JWT verification
app.post("/api/verify-token", async (req, res) => {
  const { encryptedToken } = req.body;
  try {
    const decryptedPayload = decryptPayload(encryptedToken);
    const verified = jwt.verify(decryptedPayload, process.env.JWT_SECRET);
    if (verified) {
      return res.json({
        success: true,
        user_id: verified.user_id,
        username: verified.username,
        user_type: verified.user_type,
        expiredAt: verified.exp,
        doctors: verified.doctors,
      }); // Send success and potentially user data
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    // Handle potential security errors differently than decryption errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired", code: 1 });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token signature", code: 2 });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", code: 3 }); // Avoid leaking sensitive information
    }
  }
});
// In your Express backend, add a new route in your routes file or directly, if you’re using a simple setup:

app.get("/api/getUserData", (req, res) => {
  const token = req.cookies["token"]; // Access the HTTP-only cookie
  if (!token) {
    return res.status(404).json({ error: "No token found" });
  }

  // Assuming you're storing something like userId in the token
  // You'd typically decode this token to get the data
  const userData = decodeToken(token); // Implement this function based on how you manage tokens

  res
    .status(200)
    .json({ userId: userData.userId, userType: userData.userType });
});

// Define routes
app.get("/", (req, res) => {
  res.send("Server running...");
});

// Start the server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
