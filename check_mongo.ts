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
    
    const curriculum_content = await mongoose.connection.db.collection('curriculum_contents').find({}).toArray();
    console.log('Curriculum Content Records (curriculum_contents):', curriculum_content.length);
    curriculum_content.forEach((r, i) => {
      console.log(`Record ${i}:`, JSON.stringify(r, null, 2));
    });

    const curriculum_gallery = await mongoose.connection.db.collection('curriculum_galleries').find({}).toArray();
    console.log('Curriculum Gallery Records (curriculum_galleries):', curriculum_gallery.length);

    const curriculum_activities = await mongoose.connection.db.collection('curriculum_activities').find({}).toArray();
    console.log('Curriculum Activity Records (curriculum_activities):', curriculum_activities.length);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkData();
