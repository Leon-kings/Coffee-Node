const nodemailer = require("nodemailer");
const emailConfig = require("../config/emailConfig");

// Create transporter
const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
});

const messageController = {
  /**
   * Send a message to admin email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  // sendMessageToAdmin: async (req, res) => {
  //   try {
  //     const { name, email, subject, message } = req.body;

  //     // Validate input
  //     if (!name || !email || !message) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Name, email, and message are required",
  //       });
  //     }

  //     // Email options
  //     const mailOptions = {
  //       from: `"${name}" <${email}>`,
  //       to: emailConfig.adminEmail,
  //       subject: subject || "New message from contact form",
  //       text: message,
  //       html: `
  //         <h2>New Message from ${name}</h2>
  //         <p><strong>Email:</strong> ${email}</p>
  //         <p><strong>Subject:</strong> ${subject || "No subject"}</p>
  //         <p><strong>Message:</strong></p>
  //         <p>${message}</p>
  //       `,
  //     };

  //     // Send email
  //     await transporter.sendMail(mailOptions);

  //     res.status(200).json({
  //       success: true,
  //       message: "Message sent successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to send message",
  //       error: error.message,
  //     });
  //   }
  // },
  sendMessageToAdmin: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
  
      // Validate input
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and message are required",
        });
      }
  
      // Verify transporter first
      await transporter.verify();
  
      // Email options
      const mailOptions = {
        from: `"Contact Form" <no-reply@yourdomain.com>`, // Authorized address
        replyTo: `"${name}" <${email}>`,
        to: emailConfig.adminEmail,
        subject: subject || "New message from contact form",
        text: message,
        html: `
          <h2>New Message from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };
  
      console.log('Sending email with options:', mailOptions);
  
      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
  
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
      });
    } catch (error) {
      console.error("Full email sending error:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  },
  /**
   * Verify email connection (optional, can be used during startup)
   */
  verifyEmailConnection: async () => {
    try {
      await transporter.verify();
      console.log("Server is ready to send emails");
    } catch (error) {
      console.error("Error verifying email connection:", error);
    }
  },
};

// Verify connection on startup (optional)
messageController.verifyEmailConnection();

module.exports = messageController;
