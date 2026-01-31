import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit-school';

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const curriculum_content = await mongoose.connection.db.collection('curriculum_content').find({}).toArray();
    console.log('Curriculum Content Records:', curriculum_content.length);
    curriculum_content.forEach((r, i) => {
      console.log(`Record ${i}:`, JSON.stringify(r, null, 2));
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkData();
