const Subscriber = require("../models/subscriber");
const sendEmailToAdmin = require("../config/emailConfig");
const { generateVerificationToken } = require("../config/auth"); // You'll need to implement this

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existingSub = await Subscriber.findOne({ email });
    if (existingSub) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed",
      });
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    if (newSubscriber) {
      console.log("Subscription received !!");
    }
    // Send notification to admin
    await sendEmailToAdmin({
      email,
      isSubscription: true,
      message: "New subscription request",
    });

    // Send verification email to subscriber (optional)
    const verificationToken = generateVerificationToken(email);
    // Implement sendVerificationEmail function according to your email service
    // await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing! Please check your email to verify.",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Subscription failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await Subscriber.deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our subscriptions",
      });
    }

    res.status(200).json({
      success: true,
      message: "You have been unsubscribed successfully",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Unsubscribe failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Optional: Verification endpoint
exports.verifySubscription = async (req, res) => {
  try {
    const { token } = req.params;
    // Implement token verification logic
    // ...

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired verification link",
    });
  }
};
