require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const nodemon = require("nodemon");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: "https://collins-eta.vercel.app",
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
); // Allow all origins

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // Correct hostname
  port: 587, // Port for TLS
  secure: false, // Use TLS (not SSL)

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send_email", async (req, res) => {
  const { name, email, message } = req.body;
  console.log(req.body);

  const mailOptions = {
    from: `${name}`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Email from ${name} `,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" }); //
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully" }); //
    }
  });
});
app.listen(PORT, console.log("listening to the port " + PORT));
