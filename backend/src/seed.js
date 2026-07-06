import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ email: 'admin@spotify.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`  Email: admin@spotify.com`);
      console.log(`  Password: (unchanged - use existing credentials)`);
      await mongoose.disconnect();
      return;
    }

    await User.create({
      name: 'Admin',
      email: 'admin@spotify.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created:');
    console.log('  Email: admin@spotify.com');
    console.log('  Password: admin123');
    console.log('  Role: admin');
    console.log('\nLogin and you will see the Admin Dashboard option in the user menu.');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
