import express from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import HelpRequest from '../models/HelpRequest.js';
import sendHelpEmail from '../utils/sendHelpEmail.js';

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
                return next(); // <-- Added explicit return here
            } else {
                return res.status(401).json({ message: 'Not authorized as an admin' });
            }
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Submit a help/complaint request
// @route   POST /api/help
// @access  Public (Optional Auth)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, description } = req.body;

        if (!name || !email || !subject || !description) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        let userId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production');
                userId = decoded.id;
            } catch (error) {
                // Ignore invalid tokens for public submission
            }
        }

        // Save to Database
        const helpRequest = new HelpRequest({
            user: userId,
            name,
            email,
            subject,
            description
        });
        await helpRequest.save();

        // Send the email asynchronously
        sendHelpEmail({ name, email, subject, description }).catch(err => {
            console.error('Failed to trigger help request email:', err);
        });

        res.status(200).json({ message: 'Help request submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
    }
});

// @desc    Get all help requests
// @route   GET /api/help
// @access  Private/Admin
router.get('/', protectAndAdmin, async (req, res) => {
    try {
        const requests = await HelpRequest.find({}).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Fetch help requests error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update help request resolved status
// @route   PUT /api/help/:id/resolve
// @access  Private/Admin
router.put('/:id/resolve', protectAndAdmin, async (req, res) => {
    try {
        const request = await HelpRequest.findById(req.params.id);

        if (request) {
            request.isResolved = !request.isResolved;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Help request not found' });
        }
    } catch (error) {
        console.error('Update help request status error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user's own help requests
// @route   GET /api/help/mine
// @access  Private
router.get('/mine', protect, async (req, res) => {
    try {
        // Fetch by User ID if logged in, otherwise by email if they matched it somehow (we'll stick to ID for security)
        const requests = await HelpRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Fetch my help requests error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a reply to a help request
// @route   POST /api/help/:id/reply
// @access  Private
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const request = await HelpRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Help request not found' });
        }

        // Verify ownership or Admin status
        const isOwner = request.user && request.user.toString() === req.user.id.toString();
        const userDb = await User.findById(req.user.id);
        const isAdmin = userDb && userDb.isAdmin;

        if (!isOwner && !isAdmin) {
            return res.status(401).json({ message: 'Not authorized to view or reply to this request' });
        }

        const senderType = isAdmin ? 'admin' : 'user';

        request.replies.push({
            sender: senderType,
            message: message
        });

        // If user replies to a resolved ticket, reopen it
        if (senderType === 'user' && request.isResolved) {
            request.isResolved = false;
        }

        const updatedRequest = await request.save();
        res.status(201).json(updatedRequest);

    } catch (error) {
        console.error('Reply to help request error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
