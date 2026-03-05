import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Razorpay from 'razorpay';

const router = express.Router();

// Middleware to protect routes
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
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                paymentDetails,
                totalPrice,
                isPaid: paymentMethod !== 'Cash on Delivery' // Mocking immediate payment success for non-COD 
            });

            const createdOrder = await order.save();

            // Clear the user's cart after successful order creation
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [] } }
            );

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create Razorpay Order Id
// @route   POST /api/orders/razorpay
// @access  Private
router.post('/razorpay', protect, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID_HERE') {
            console.warn('Razorpay keys not configured. Returning mock order.');
            return res.json({
                id: `mock_order_${Date.now()}`,
                amount: amount * 100,
                currency: "INR"
            });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch user orders error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, adminAuth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Update order delivery error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update order tracking details
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
router.put('/:id/tracking', protect, adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        const { trackingNumber, trackingUrl } = req.body;

        if (order) {
            order.trackingNumber = trackingNumber;
            order.trackingUrl = trackingUrl;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Update order tracking error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a reply to an order
// @route   POST /api/orders/:id/reply
// @access  Private (User or Admin)
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isOwner = order.user._id.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            return res.status(401).json({ message: 'Not authorized to reply to this order' });
        }

        const senderType = isAdmin ? 'admin' : 'user';

        // Add reply
        order.replies.push({
            sender: senderType,
            message: message
        });

        const updatedOrder = await order.save();

        // --- Notification & Email Logic ---
        try {
            const Notification = await import('../models/Notification.js').then(m => m.default);
            const isReplyingToAdmin = senderType === 'user';

            // 1. Create In-App Notification
            await Notification.create({
                recipient: isReplyingToAdmin ? 'Admin' : order.user._id.toString(),
                sender: senderType === 'admin' ? 'Admin' : 'User',
                type: 'Order',
                message: `New reply on order #${order._id.toString().substring(0, 8)}`,
                relatedId: order._id,
                onModel: 'Order'
            });

            // 2. Send Email
            const sendReplyEmail = await import('../utils/sendReplyEmail.js').then(m => m.default);
            if (isReplyingToAdmin) {
                sendReplyEmail({
                    toEmail: 'calsyog@gmail.com',
                    subject: `[New Reply] Order #${order._id.toString().substring(0, 8)}`,
                    text: `User ${order.user.name} replied to their order.\n\nMessage: ${message}`,
                    html: `<p>User <b>${order.user.name}</b> replied to order <b>#${order._id}</b>.</p><p><b>Message:</b><br/>${message}</p>`
                });
            } else {
                sendReplyEmail({
                    toEmail: order.user.email,
                    subject: `[Updates on your Order] #${order._id.toString().substring(0, 8)}`,
                    text: `Admin replied to your order.\n\nMessage: ${message}`,
                    html: `<p>The CalsYog Team has replied to your order <b>#${order._id}</b>.</p><p><b>Message:</b><br/>${message}</p>`
                });
            }
        } catch (notifErr) {
            console.error('Failed to send notification for order reply:', notifErr);
        }

        res.status(201).json(updatedOrder);

    } catch (error) {
        console.error('Reply to order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
