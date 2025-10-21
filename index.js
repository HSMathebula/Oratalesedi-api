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
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Missing required fields" });

  try {
    await transporter.sendMail({
      from: `"Oratalesedi Contact" <${process.env.SMTP_LOGIN}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <h3>Contact Form</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <h4>Message</h4>
        <p>${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// ✅ QUOTE FORM
app.post("/submit-quote", async (req, res) => {
  const { name, email, company, phone, service, budget, message } = req.body;

  if (!name || !email || !service)
    return res.status(400).json({ success: false, message: "Missing required fields" });

  try {
    await transporter.sendMail({
      from: `"Oratalesedi Quote" <${process.env.SMTP_LOGIN}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      html: `
        <h3>Quote Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Company:</b> ${company || "N/A"}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Budget:</b> ${budget || "N/A"}</p>
        <h4>Message</h4>
        <p>${message || "N/A"}</p>
      `,
    });

    res.json({ success: true, message: "Quote request sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send quote." });
  }
});

app.listen(3000, () => console.log("🚀 Oratalesedi Form API running on port 3000"));
