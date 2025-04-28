const nodemailer = require("nodemailer");
const generateQR = require("./generateQR");

const sendEmail = async (to, studentName, eventName, qrText, isApproved) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Only generate a QR code if the student is approved
    let qrCodeDataUrl = "";
    if (isApproved) {
      qrCodeDataUrl = await generateQR(qrText);
    }

    const subject = isApproved ? "Your Ticket is Successfully Created!" : "Your Ticket Application is Rejected";
    const textMessage = isApproved
      ? `Hello ${studentName},\n\nYour ticket for "${eventName}" has been successfully created. Please present the QR code below at the entry point.\n\nThank you!`
      : `Hello ${studentName},\n\nUnfortunately, your details do not match the college database. As a result, your ticket application for "${eventName}" has been rejected.\n\nThank you for your understanding.`;

    const htmlMessage = isApproved
      ? `
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>Your ticket for <strong>${eventName}</strong> has been successfully created!</p>
        <p>Please show the QR code below at the entry point for verification.</p>
        <img src="cid:qrcode" alt="QR Code" />
        <p>Thank you!</p>`
      : `
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>Unfortunately, your details do not match the college database. As a result, your ticket application for <strong>${eventName}</strong> has been rejected.</p>
        <p>Thank you for your understanding.</p>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: textMessage,
      html: htmlMessage,
    };

    // Only include QR code attachment if the student is approved
    if (isApproved) {
      mailOptions.attachments = [
        {
          filename: "qrcode.png",
          path: qrCodeDataUrl,
          cid: "qrcode",
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    console.log(`Email successfully sent to ${to}`);
    return { success: true, message: `Email successfully sent to ${to}` };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};

module.exports = sendEmail;
