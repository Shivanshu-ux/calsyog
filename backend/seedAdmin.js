import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/calsyog');
        console.log('MongoDB connected for seeding');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = await User.findOneAndUpdate(
            { email: 'admin@admin' },
            {
                name: 'Admin User',
                password: hashedPassword,
                isAdmin: true
            },
            { new: true, upsert: true }
        );

        console.log('Admin user seeded:', adminUser.email);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
