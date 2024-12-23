// Import required modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");

// Import database and cloudinary
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "https://studyhub-murex.vercel.app", // Frontend URL
  "http://localhost:3000", // Localhost for development
];

app.use((req, res, next) => {
  console.log(`Request Origin: ${req.headers.origin || "undefined"}`); // Debug incoming origin
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow requests with no origin (e.g., Postman) or from allowed origins
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and credentials
  })
);

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp",
  })
);

// Connect to Cloudinary
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contact", contactUsRoute);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running at PORT ${PORT}`);
});
