const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // Create a transporter object using the Gmail service
    let transporter = nodemailer.createTransport({
      service: "gmail", // Gmail service
      auth: {
        user: process.env.MAIL_USER, // Your email address
        pass: process.env.MAIL_PASS, // Your email password or App Password
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: `"Study Notion" <${process.env.MAIL_USER}>`, // Sender's email
      to: email, // Send the email to the user's email
      subject: title,
      html: body, // Email body in HTML format
    });

    console.log("Email sent:", info.response);
    return true; // Return true on success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Return false if an error occurs
  }
};

module.exports = mailSender;
