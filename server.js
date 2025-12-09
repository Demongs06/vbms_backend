require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 10000;

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'https://demonsworkshop.vercel.app/' })); // set CLIENT_ORIGIN in Render for security
app.use(express.json());
app.use(morgan('dev'));

// Mongo
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo error', err);
    process.exit(1);
  });

// Models
const requestSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  email: String,
  vehicleType: String,
  vehicleNumber: String,
  problemType: String,
  description: String,
  latitude: Number,
  longitude: Number,
  status: { type: String, default: 'Pending' }, // Pending, Accepted, In Progress, Completed, Cancelled
  assignedDriver: String,
  assignedMechanic: String,
  createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

const billSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  customerName: String,
  serviceType: String,
  baseAmount: Number,
  additionalCharges: Number,
  tax: Number,
  total: Number,
  status: { type: String, default: 'Unpaid' },
  createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const reviewSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  customerName: String,
  rating: Number,
  reviewText: String,
  serviceType: String,
  createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const staffSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  type: String, // Driver or Mechanic
  available: { type: Boolean, default: true }
});

const Request = mongoose.model('Request', requestSchema);
const Bill = mongoose.model('Bill', billSchema);
const Review = mongoose.model('Review', reviewSchema);
const Staff = mongoose.model('Staff', staffSchema);

// Routes
app.get('/', (req, res) => res.json({ ok: true }));

// Requests CRUD
app.post('/api/requests', async (req, res) => {
  try {
    // Basic server-side validation
    const { customerName, customerPhone, customerEmail, vehicleType, vehicleNumber, problemType, description, latitude, longitude } = req.body;
    if (!customerName || !customerPhone || !problemType) return res.status(400).json({ error: 'Missing required fields' });

    const r = new Request({
      customerName,
      phone: customerPhone,
      email: customerEmail,
      vehicleType,
      vehicleNumber,
      problemType,
      description,
      latitude,
      longitude
    });
    await r.save();
    return res.status(201).json(r);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const all = await Request.find().sort({ createdAt: -1 });
    return res.json(all);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/requests/:id', async (req, res) => {
  try {
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    return res.json(r);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/requests/:id', async (req, res) => {
  // replace full doc or update selected fields
  try {
    const updated = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

// change status or assign staff
app.patch('/api/requests/:id/status', async (req, res) => {
  try {
    const { status, assignedDriver, assignedMechanic } = req.body;
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });

    if (status) r.status = status;
    if (assignedDriver !== undefined) r.assignedDriver = assignedDriver;
    if (assignedMechanic !== undefined) r.assignedMechanic = assignedMechanic;
    await r.save();
    return res.json(r);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

// Bills
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    return res.json(bills);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/bills/request/:requestId', async (req, res) => {
  try {
    const bill = await Bill.findOne({ requestId: req.params.requestId });
    return res.json(bill);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/bills/generate/:requestId', async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'Completed') return res.status(400).json({ error: 'Service not completed' });

    const baseAmount = Math.floor(Math.random() * 3000) + 500;
    const additionalCharges = Math.floor(Math.random() * 500);
    const tax = Math.round((baseAmount + additionalCharges) * 0.18);
    const total = baseAmount + additionalCharges + tax;

    const bill = new Bill({
      requestId: request._id,
      customerName: request.customerName,
      serviceType: request.problemType,
      baseAmount,
      additionalCharges,
      tax,
      total
    });

    await bill.save();
    return res.status(201).json(bill);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.patch('/api/bills/:id/pay', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Not found' });
    bill.status = 'Paid';
    await bill.save();
    return res.json(bill);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

// Reviews
app.post('/api/reviews', async (req, res) => {
  try {
    const { requestId, customerName, rating, reviewText, serviceType } = req.body;
    if (!rating || !requestId) return res.status(400).json({ error: 'Missing rating or requestId' });
    const review = new Review({ requestId, customerName, rating, reviewText, serviceType });
    await review.save();
    return res.status(201).json(review);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const r = await Review.find().sort({ createdAt: -1 });
    return res.json(r);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

// Staff
app.get('/api/staff', async (req, res) => {
  try {
    const s = await Staff.find().sort({ name: 1 });
    return res.json(s);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/staff', async (req, res) => {
  try {
    const st = new Staff(req.body);
    await st.save();
    return res.status(201).json(st);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/staff/:id', async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updated);
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) { return res.status(500).json({ error: 'Server error' }); }
});

// Start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
