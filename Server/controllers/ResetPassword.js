const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Ensure mailSender is correctly imported

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    // Check if the email exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `This Email: ${email} is not Registered With Us. Please Enter a Valid Email.`,
      });
    }

    // Generate the reset token
    const token = crypto.randomBytes(20).toString("hex");

    // Update the user document with the token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour expiration
      },
      { new: true }
    );

    // Log the updated details for debugging
    // console.log("Updated User Details:", updatedDetails);

    // Create the reset password URL
    const url = `http://localhost:3000/update-password/${token}`;

    // Debugging: Check the URL and email being sent
    // console.log("Reset Password URL:", url);

    // Send the reset email
    const emailSent = await mailSender(
      email,
      "Password Reset",
      `You requested a password reset. Click on the link to reset your password: ${url}. The link expires in 1 hour.`
    );

    // Check if the email was successfully sent
    if (emailSent) {
      res.json({
        success: true,
        message:
          "Email Sent Successfully. Please Check Your Email to Continue.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again later.",
      });
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error in resetPasswordToken:", error);

    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Some Error in Sending the Reset Message.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );
    res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};
