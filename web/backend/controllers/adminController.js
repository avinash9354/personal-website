const Message = require('../models/Message');
const Project = require('../models/Project');

// @desc    Get system statistics for Admin AI
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject status createdAt');

    const totalProjects = await Project.countDocuments();
    const projectTitles = await Project.find().select('title -_id').limit(10);

    res.json({
      success: true,
      stats: {
        messages: {
          total: totalMessages,
          unread: unreadMessages,
          recent: recentMessages
        },
        projects: {
          total: totalProjects,
          titles: projectTitles.map(p => p.title)
        },
        system: {
          uptime: process.uptime(),
          nodeVersion: process.version,
          platform: process.platform
        }
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getSystemStats };
