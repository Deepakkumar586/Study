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

const allowedOrigins = [
  "https://studyhub-murex.vercel.app", // Deployed frontend
  "http://localhost:3000", // Local development
];

// Debugging middleware to log origins
app.use((req, res, next) => {
  const origin = req.headers.origin || "undefined";
  console.log(`[server] Request Origin: ${origin}`);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with undefined origins (health checks, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`[server] Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
