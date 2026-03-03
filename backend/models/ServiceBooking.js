import mongoose from 'mongoose';

const serviceBookingSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true,
        enum: ['Calisthenics', 'Yoga'],
    },
    classMode: {
        type: String,
        required: true,
        enum: ['Online', 'Offline'],
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isContacted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

export default ServiceBooking;
