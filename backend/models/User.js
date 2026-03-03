import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Password is only required if the user registers via email/password, not OAuth
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    googleId: {
        type: String,
        sparse: true,
    },
    name: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
