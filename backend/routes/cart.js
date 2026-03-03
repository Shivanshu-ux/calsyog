import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { productId, name, price, quantity, image } = req.body;

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: [{ productId, name, price, quantity: quantity || 1, image }]
            });
        } else {
            const itemIndex = cart.items.findIndex(p => p.productId === productId);

            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                productItem.quantity += (quantity || 1);
                cart.items[itemIndex] = productItem;
            } else {
                cart.items.push({ productId, name, price, quantity: quantity || 1, image });
            }
            await cart.save();
        }

        res.status(201).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId !== req.params.productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
