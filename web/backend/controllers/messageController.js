const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// @desc    Send message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      ...req.body,
      subject: req.body.subject || `New message from ${req.body.name}`,
      userId: req.user ? req.user._id : null
    });

    // Send email notification - Wrapped in try-catch to prevent blocking
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
        subject: `New Message from ${req.body.name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Subject:</strong> ${req.body.subject || 'N/A'}</p>
          <p><strong>Message:</strong> ${req.body.message}</p>
          <p><strong>Project Type:</strong> ${req.body.projectType || 'N/A'}</p>
          <p><strong>Budget:</strong> ${req.body.budget || 'N/A'}</p>
          <p><strong>Timeline:</strong> ${req.body.timeline || 'N/A'}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.warn('Email notification failed:', emailError.message);
      // We don't throw here so the response still returns success
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const messages = await Message.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email');

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  updateMessageStatus
};