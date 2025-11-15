import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------
// SMTP CONFIG (Brevo)
// -------------------------

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
});

// -------------------------
// ROOT CHECK
// -------------------------
app.get("/", (req, res) => {
  res.send("Oratalesedi API is running ✔");
});

// ======================================================
// CONTACT FORM ENDPOINT
// ======================================================
app.post("/contact", async (req, res) => {
  try {
    console.log("📧 Contact form received:", req.body);

    const { name, email, phone, service, company, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const mailOptions = {
      from: process.env.BREVO_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Company:</b> ${company}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully ✉️"
    });

  } catch (error) {
    console.error("❌ Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error sending message"
    });
  }
});

// ======================================================
// QUOTE FORM ENDPOINT
// ======================================================
app.post("/quote", async (req, res) => {
  try {
    console.log("📨 Quote Request Received:", req.body);

    const {
      projectType,
      projectScope,
      timeline,
      budget,
      description,
      company,
      contactPerson,
      email,
      phone,
      location,
      urgency
    } = req.body;

    const mailOptions = {
      from: process.env.BREVO_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Quote Request - ${projectType}`,
      html: `
        <h2>New Quote Request</h2>

        <h3>Project Details</h3>
        <p><b>Type:</b> ${projectType}</p>
        <p><b>Scope:</b> ${projectScope}</p>
        <p><b>Timeline:</b> ${timeline}</p>
        <p><b>Budget:</b> ${budget}</p>
        <p><b>Description:</b> ${description}</p>

        <h3>Company Info</h3>
        <p><b>Company:</b> ${company}</p>
        <p><b>Contact Person:</b> ${contactPerson}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Location:</b> ${location}</p>

        <h3>Urgency</h3>
        <p><b>Urgency:</b> ${urgency}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Quote request sent successfully ✔"
    });

  } catch (error) {
    console.error("❌ Quote form error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error submitting quote"
    });
  }
});

// -------------------------
// START SERVER
// -------------------------

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Oratalesedi API live on port ${port}`);
  console.log("📧 Email system loaded (Brevo SMTP)");
  console.log("Available endpoints:");
  console.log("  POST /contact");
  console.log("  POST /quote");
});
