
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const User = mongoose.model('users', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({});
    
    console.log('USERS_START');
    console.log(JSON.stringify(users, null, 2));
    console.log('USERS_END');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
