import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔧 Setup Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

// ✅ CONTACT FORM
app.post("/submit-contact", async (req, res) => {
  const { name, email, phone, service, company, message } = req.body;

  console.log("📧 Contact form received:", { name, email, phone, service, company, message });

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Missing required fields: name, email, and message are required" });

  try {
    await transporter.sendMail({
      from: `"Oratalesedi Contact" <${process.env.SMTP_LOGIN}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Company:</b> ${company || "N/A"}</p>
        <p><b>Service Interest:</b> ${service || "N/A"}</p>
        <h4>Message:</h4>
        <p>${message}</p>
      `,
    });

    console.log("✅ Contact email sent successfully");
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
});

// ✅ QUOTE FORM
app.post("/submit-quote", async (req, res) => {
  const { projectType, projectScope, timeline, budget, company, contactPerson, email, phone, location, description, urgency } = req.body;

  console.log("📋 Quote form received:", { projectType, projectScope, timeline, budget, company, contactPerson, email, phone, location, description, urgency });

  if (!projectType || !company || !contactPerson || !email || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields: Service Type, Company Name, Contact Person, Email, and Phone are required" 
    });
  }

  try {
    await transporter.sendMail({
      from: `"Oratalesedi Quote" <${process.env.SMTP_LOGIN}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Quote Request from ${contactPerson} (${company})`,
      html: `
        <h3>Quote Request</h3>
        <p><b>Company:</b> ${company}</p>
        <p><b>Contact Person:</b> ${contactPerson}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <hr>
        <h4>Project Details</h4>
        <p><b>Service Type:</b> ${projectType}</p>
        <p><b>Project Scope:</b> ${projectScope || "N/A"}</p>
        <p><b>Timeline:</b> ${timeline || "N/A"}</p>
        <p><b>Budget Range:</b> ${budget || "N/A"}</p>
        <p><b>Location:</b> ${location || "N/A"}</p>
        <p><b>Urgency:</b> ${urgency || "standard"}</p>
        <h4>Project Description:</h4>
        <p>${description || "N/A"}</p>
      `,
    });

    console.log("✅ Quote email sent successfully");
    res.json({ success: true, message: "Quote request sent successfully! We will contact you within 24 hours." });
  } catch (err) {
    console.error("❌ Quote form error:", err);
    res.status(500).json({ success: false, message: "Failed to send quote. Please try again." });
  }
});

app.listen(3000, () => {
  console.log("🚀 Oratalesedi Form API running on port 3000");
  console.log("📧 SMTP configured with Brevo");
  console.log("✅ Available endpoints:");
  console.log("   POST /submit-contact");
  console.log("   POST /submit-quote");
  
  // Check environment variables
  if (!process.env.SMTP_LOGIN || !process.env.SMTP_PASSWORD || !process.env.RECEIVER_EMAIL) {
    console.error("⚠️ WARNING: Missing environment variables!");
    console.error("   Required: SMTP_LOGIN, SMTP_PASSWORD, RECEIVER_EMAIL");
  }
});
