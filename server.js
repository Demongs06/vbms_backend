require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
// Route imports
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const staffRoutes = require('./routes/staff');
const billRoutes = require('./routes/bills');
const reviewRoutes = require('./routes/reviews');
// Initialize Express app
const app = express();
// Connect to MongoDB
connectDB();
// Middleware
app.use(cors({
origin: process.env.FRONTEND_URL || 'https://demonsworkshop.vercel.app/',
credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/reviews', reviewRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
res.status(200).json({
status: 'OK',
message: 'Server is running',
timestamp: new Date().toISOString()
});
});
// Error handling middleware
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(err.statusCode || 500).json({
success: false,
error: err.message || 'Server Error'
});
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

