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

export default router;
