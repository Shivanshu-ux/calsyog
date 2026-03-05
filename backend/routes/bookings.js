import express from 'express';
import ServiceBooking from '../models/ServiceBooking.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to protect routes and verify admin
const protectAndAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production');
            req.user = await User.findById(decoded.id).select('-password');

            if (req.user && req.user.isAdmin) {
                next();
            } else {
                res.status(401).json({ message: 'Not authorized as an admin' });
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Create a new service booking
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { serviceType, classMode, name, email, phone } = req.body;

        if (!serviceType || !classMode || !name || !email || !phone) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const booking = new ServiceBooking({
            serviceType,
            classMode,
            name,
            email,
            phone
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all service bookings
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protectAndAdmin, async (req, res) => {
    try {
        const bookings = await ServiceBooking.find({}).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get logged in user's service bookings
// @route   GET /api/bookings/mybookings
// @access  Private
// Note: Bookings are tracked by email currently in ServiceBooking schema.
router.get('/mybookings', async (req, res) => {
    try {
        let userDb = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production');
                userDb = await User.findById(decoded.id);
            } catch (err) { }
        }

        if (!userDb) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Fetch user's bookings matching their email
        const bookings = await ServiceBooking.find({ email: userDb.email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Fetch my bookings error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update booking contact status
// @route   PUT /api/bookings/:id/contacted
// @access  Private/Admin
router.put('/:id/contacted', protectAndAdmin, async (req, res) => {
    try {
        const booking = await ServiceBooking.findById(req.params.id);

        if (booking) {
            booking.isContacted = !booking.isContacted;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a reply to a service booking
// @route   POST /api/bookings/:id/reply
// @access  Private (User or Admin)
// Note: Bookings right now don't enforce user login strictly on creation, but for replying users must be logged in. 
// A better way is to verify email, but we'll assume logged in user or admin.
router.post('/:id/reply', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const booking = await ServiceBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Identify user via token
        let userDb = null;
        let senderType = 'user';

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production');
                userDb = await User.findById(decoded.id);
                if (userDb && userDb.isAdmin) {
                    senderType = 'admin';
                }
            } catch (err) { }
        }

        if (!userDb) {
            return res.status(401).json({ message: 'Not authorized to reply' });
        }

        // Add reply
        booking.replies.push({
            sender: senderType,
            message: message
        });

        const updatedBooking = await booking.save();

        // --- Notification & Email Logic ---
        try {
            const isReplyingToAdmin = senderType === 'user';

            // 1. Create In-App Notification
            const Notification = await import('../models/Notification.js').then(m => m.default);
            // Since bookings don't currently store user ID, we approximate by email or rely on Admin notifications
            await Notification.create({
                recipient: isReplyingToAdmin ? 'Admin' : (userDb ? userDb._id.toString() : 'Guest'),
                sender: senderType === 'admin' ? 'Admin' : 'User',
                type: 'Service',
                message: `New reply on service booking for ${booking.serviceType}`,
                relatedId: booking._id,
                onModel: 'ServiceBooking'
            });

            // 2. Send Email
            if (isReplyingToAdmin) {
                const sendReplyEmail = await import('../utils/sendReplyEmail.js').then(m => m.default);
                sendReplyEmail({
                    toEmail: 'calsyog@gmail.com',
                    subject: `[New Reply] Service Booking (${booking.serviceType})`,
                    text: `User replied to booking.\n\nMessage: ${message}`,
                    html: `<p>User <b>${booking.name}</b> replied to their service booking for <b>${booking.serviceType}</b>.</p><p><b>Message:</b><br/>${message}</p>`
                });
            } else {
                const sendReplyEmail = await import('../utils/sendReplyEmail.js').then(m => m.default);
                sendReplyEmail({
                    toEmail: booking.email,
                    subject: `[Updates on your Booking] ${booking.serviceType}`,
                    text: `Admin replied to your booking.\n\nMessage: ${message}`,
                    html: `<p>The CalsYog Team has replied to your service booking for <b>${booking.serviceType}</b>.</p><p><b>Message:</b><br/>${message}</p>`
                });
            }
        } catch (notifErr) {
            console.error('Failed to send notification for booking reply:', notifErr);
        }

        res.status(201).json(updatedBooking);

    } catch (error) {
        console.error('Reply to booking error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
