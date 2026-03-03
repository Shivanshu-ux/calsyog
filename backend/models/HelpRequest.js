import mongoose from 'mongoose';

const helpRequestSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // Optional because non-logged-in users can still submit
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isResolved: {
            type: Boolean,
            required: true,
            default: false,
        },
        replies: [
            {
                sender: { type: String, required: true }, // 'admin' or 'user'
                message: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            }
        ]
    },
    {
        timestamps: true,
    }
);

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
export default HelpRequest;
