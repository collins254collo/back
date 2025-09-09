require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: "https://collins-eta.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Auto-reply function
const sendAutoReply = async (recipientEmail, recipientName) => {
  try {
    const info = await transporter.sendMail({
      from: `"Collins Njogu" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Thanks for contacting me",
      text: `Hello ${recipientName || ""},\n\nThank you for your email. I’ve received your message and will respond to you shortly.\n\nBest regards,\nCollins Njogu`,
      html: `
        <p>Hello <b>${recipientName || ""}</b>,</p>
        <p>Thank you for your email. I’ve received your message and will respond to you shortly.</p>
        <br/>
        <p>Best regards,<br/>Collins Njogu</p>
      `,
    });

    console.log("Auto-reply sent:", info.messageId);
  } catch (error) {
    console.error(" Error sending auto-reply:", error);
  }
};

// Main contact route
app.post("/send_email", async (req, res) => {
  const { name, email, message } = req.body;
  console.log(req.body);

  const mailOptions = {
    from: `${name} <${email}>`, // sender info
    to: process.env.EMAIL_USER, // your inbox
    replyTo: email,
    subject: `Email from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // send auto reply
    await sendAutoReply(email, name);

    res.status(200).json({ message: "Email & auto-reply sent successfully" });
  } catch (error) {
    console.error(" Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
