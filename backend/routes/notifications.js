import express from 'express';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to protect routes (get user info from token)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get all notifications for a user (or admin)
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const recipient = req.user.isAdmin ? 'Admin' : req.user.id.toString();

        const notifications = await Notification.find({ recipient })
            .sort({ createdAt: -1 })
            .limit(50); // Get latest 50 notifications

        res.json(notifications);
    } catch (error) {
        console.error('Fetch notifications error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        const recipient = req.user.isAdmin ? 'Admin' : req.user.id.toString();

        if (notification.recipient !== recipient) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Update notification status error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
