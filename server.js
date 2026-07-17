const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

let dbStatus = "not_configured";

async function connectDatabase() {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is missing. Contact messages will not be saved.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    dbStatus = "connected";
    console.log("MongoDB connected");
  } catch (error) {
    dbStatus = "error";
    console.error("MongoDB connection error:", error.message);
  }
}

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    subject: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 3000 }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

function getTransporter() {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: dbStatus,
    mongoReadyState: mongoose.connection.readyState
  });
});

app.post(["/api/contact", "/contact"], async (req, res) => {
  const { name = "", email = "", subject = "", message = "" } = req.body || {};
  const cleanMessage = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    subject: String(subject).trim(),
    message: String(message).trim()
  };

  if (!cleanMessage.name || !cleanMessage.email || !cleanMessage.message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  if (!isValidEmail(cleanMessage.email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected. Please try again later." });
  }

  try {
    await Message.create(cleanMessage);

    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: cleanMessage.email,
        to: process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER,
        subject: cleanMessage.subject || "New portfolio contact message",
        text: `Name: ${cleanMessage.name}
Email: ${cleanMessage.email}

Message:
${cleanMessage.message}`
      });
    }

    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    console.error("Contact save error:", error.message);
    res.status(500).json({ error: "Could not save the message right now." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

connectDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
