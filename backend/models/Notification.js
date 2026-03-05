import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: String, // 'Admin' or User ObjectId as string
            required: true,
        },
        sender: {
            type: String, // 'Admin' or 'User' or 'System'
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Help', 'Order', 'Service'],
        },
        message: {
            type: String,
            required: true,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel',
        },
        onModel: {
            type: String,
            required: true,
            enum: ['HelpRequest', 'Order', 'ServiceBooking']
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Notification', notificationSchema);
