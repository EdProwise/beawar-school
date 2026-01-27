import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit-school';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Generic Schema to handle dynamic tables
const DynamicSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// Helper to get or create model
const getModel = (tableName: string) => {
  return mongoose.models[tableName] || mongoose.model(tableName, DynamicSchema);
};

// Generic API Routes
    app.get('/api/:table', async (req, res) => {
    try {
      const { table } = req.params;
      const { select, sort, order, limit, count, head, ...filters } = req.query;
      
      const Model = getModel(table);
      
      // Build filter object
      const mongoFilter: any = {};
      Object.keys(filters).forEach(key => {
        const val = filters[key];
        if (key.endsWith('_gte')) {
          const field = key.replace('_gte', '');
          mongoFilter[field] = { ...mongoFilter[field], $gte: val };
        } else if (key.endsWith('_lte')) {
          const field = key.replace('_lte', '');
          mongoFilter[field] = { ...mongoFilter[field], $lte: val };
        } else if (key.endsWith('_neq')) {
          const field = key.replace('_neq', '');
          mongoFilter[field] = { ...mongoFilter[field], $ne: val };
        } else {
          mongoFilter[key] = val;
        }
      });

      if (head === 'true') {
        const totalCount = await Model.countDocuments(mongoFilter);
        return res.json({ count: totalCount });
      }

      let query = Model.find(mongoFilter);
      
      if (select && typeof select === 'string') {
        query = query.select(select.split(',').join(' '));
      }
      
      if (sort && typeof sort === 'string') {
        const sortObj: any = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;
        query = query.sort(sortObj);
      }
      
      if (limit) {
        query = query.limit(parseInt(limit as string));
      }
      
      const data = await query.exec();
      
      if (count === 'exact') {
        const totalCount = await Model.countDocuments(mongoFilter);
        res.json({ data, count: totalCount });
      } else {
        res.json(data);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/api/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const Model = getModel(table);
    const newItem = new Model(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;
    const Model = getModel(table);
    
    // Support finding by custom 'id' field or MongoDB '_id'
    const updatedItem = await Model.findOneAndUpdate(
      { $or: [{ id: id }, { _id: mongoose.isValidObjectId(id) ? id : undefined }] },
      req.body,
      { new: true }
    );
    
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;
    const Model = getModel(table);
    await Model.findOneAndDelete({ $or: [{ id: id }, { _id: mongoose.isValidObjectId(id) ? id : undefined }] });
    res.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/:table/upsert', async (req, res) => {
  try {
    const { table } = req.params;
    const { data } = req.body;
    const Model = getModel(table);
    
    // For upsert, we use the 'id' field if provided, or fallback to data.id
    const id = data.id;
    const result = await Model.findOneAndUpdate(
      { id: id },
      data,
      { upsert: true, new: true }
    );
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
