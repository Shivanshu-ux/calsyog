import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: String, // Keeping as string to match existing productId logic in Cart
                required: true,
            },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit/Debit Card', 'UPI', 'Cash on Delivery'],
    },
    paymentDetails: {
        // Optional details for mocking
        upiId: { type: String },
        cardNumberLast4: { type: String },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    trackingNumber: {
        type: String,
    },
    trackingUrl: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
