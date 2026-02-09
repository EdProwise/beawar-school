import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit-school';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // In multer, req.body might not be populated yet unless fields are before files
      // and even then it depends on the setup. 
      // We'll fallback to a safer default if path is missing.
      const rawPath = req.body.path || '';
      const uploadPath = rawPath ? path.dirname(rawPath) : '.';
      const dest = path.resolve(process.cwd(), 'uploads', uploadPath);
      
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    } catch (err: any) {
      cb(err, '');
    }
  },
  filename: (req, file, cb) => {
    const rawPath = req.body.path || '';
    if (rawPath) {
      cb(null, path.basename(rawPath));
    } else {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for videos
});

// Storage Upload Route
app.post('/api/storage/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Calculate relative path for URL
      const relativePath = path.relative(path.join(process.cwd(), 'uploads'), req.file.path).replace(/\\/g, '/');
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${relativePath}`;
      
      res.json({ data: { path: relativePath, url: fileUrl } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Storage Delete Route
app.delete('/api/storage/remove', (req, res) => {
  try {
    const { paths } = req.body;
    if (!paths || !Array.isArray(paths)) {
      return res.status(400).json({ error: 'Paths array is required' });
    }

    paths.forEach(filePath => {
      const fullPath = path.join(uploadsDir, path.basename(filePath));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    res.json({ data: paths, error: null });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = getModel('users');
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ user: { id: user.id || user._id, email: user.email }, session: { access_token: 'mock-token', user: { id: user.id || user._id, email: user.email } } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, data } = req.body;
    const User = getModel('users');
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const id = new mongoose.Types.ObjectId().toString();
    const newUser = new User({ id, email, password, ...data });
    await newUser.save();
    
    // Also create a profile
    const Profile = getModel('profiles');
    await new Profile({ id, email, ...data }).save();
    
    res.json({ user: { id, email }, session: { access_token: 'mock-token', user: { id, email } } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/:table', async (req, res) => {
    try {
      const { table } = req.params;
      const { select, sort, order, limit, count, head, ...filters } = req.query;
      
      const Model = getModel(table);
      
      // Build filter object
      const mongoFilter: any = {};
        Object.keys(filters).forEach(key => {
          let val = filters[key] as any;
          if (val === 'true') val = true;
          if (val === 'false') val = false;

          if (key.endsWith('_gte')) {
          const field = key.replace('_gte', '');
          mongoFilter[field] = { ...mongoFilter[field], $gte: val };
        } else if (key.endsWith('_lte')) {
          const field = key.replace('_lte', '');
          mongoFilter[field] = { ...mongoFilter[field], $lte: val };
        } else if (key.endsWith('_neq')) {
          const field = key.replace('_neq', '');
          mongoFilter[field] = { ...mongoFilter[field], $ne: val };
        } else if (key.endsWith('_in')) {
          const field = key.replace('_in', '');
          try {
            mongoFilter[field] = { ...mongoFilter[field], $in: JSON.parse(val as string) };
          } catch (e) {
            mongoFilter[field] = val;
          }
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

app.delete('/api/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { ...filters } = req.query;
    const Model = getModel(table);
    
    const mongoFilter: any = {};
    Object.keys(filters).forEach(key => {
      let val = filters[key] as any;
      if (val === 'true') val = true;
      if (val === 'false') val = false;

      if (key.endsWith('_in')) {
        const field = key.replace('_in', '');
        if (field === 'id') {
          try {
            const ids = JSON.parse(val as string);
            mongoFilter['$or'] = [
              { id: { $in: ids } },
              { _id: { $in: ids.filter((id: string) => mongoose.isValidObjectId(id)) } }
            ];
          } catch (e) {
            mongoFilter[field] = val;
          }
        } else {
          try {
            mongoFilter[field] = { ...mongoFilter[field], $in: JSON.parse(val as string) };
          } catch (e) {
            mongoFilter[field] = val;
          }
        }
      } else {
        if (key === 'id') {
          mongoFilter['$or'] = [
            { id: val },
            { _id: mongoose.isValidObjectId(val) ? val : undefined }
          ].filter(q => q._id !== undefined || q.id !== undefined);
        } else {
          mongoFilter[key] = val;
        }
      }
    });

    await Model.deleteMany(mongoFilter);
    res.json({ message: 'Deleted successfully' });
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
    const { data, onConflict } = req.body;
    const Model = getModel(table);
    const conflictKey = onConflict || 'id';
    
    console.log(`Upserting to ${table}, conflict key: ${conflictKey}`);
    
    const items = Array.isArray(data) ? data : [data];

    const results = [];
    for (const item of items) {
      let filter: any = {};
      const { _id, ...itemData } = item;
      
      if (item[conflictKey]) {
        const val = item[conflictKey];
        if (conflictKey === 'id' || conflictKey === '_id') {
          filter['$or'] = [
            { id: val },
            { _id: mongoose.isValidObjectId(val) ? val : undefined }
          ].filter(q => q._id !== undefined || q.id !== undefined);
          console.log(`Searching by ${conflictKey}: ${val}, Filter:`, JSON.stringify(filter));
        } else {
          filter[conflictKey] = val;
        }
      } else {
        filter._id = new mongoose.Types.ObjectId();
        console.log(`No conflict key found, creating new record with _id: ${filter._id}`);
      }

      
      const result = await Model.findOneAndUpdate(
        filter,
        itemData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(result);
    }
    
    res.json(Array.isArray(data) ? results : results[0]);
  } catch (error: any) {
    console.error('Upsert error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// Serve frontend (Vite SPA)
// ===============================
const distPath = path.join(process.cwd(), 'dist');

if (fs.existsSync(distPath)) {
  // 1️⃣ Serve static assets FIRST
  app.use('/assets', express.static(path.join(distPath, 'assets')));

  // 2️⃣ Serve other static files (favicon, etc.)
  app.use(express.static(distPath));

  // 3️⃣ SPA fallback LAST (do NOT catch assets)
  app.use((req, res) => {
    const indexPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
      return res.status(404).send('Not found');
    }

    let html = fs.readFileSync(indexPath, 'utf8');
    html = injectMetaTags(html, req.path);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
}


// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
