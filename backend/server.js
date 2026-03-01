require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const parentRoutes = require('./routes/parentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const smsRoutes = require('./routes/smsRoutes');
const healthRoutes = require('./routes/healthRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const exportRoutes = require('./routes/exportRoutes');

// Debug: Verify environment variables are loaded
console.log('Environment Check:', {
  PORT: process.env.PORT,
  OPENAI_ENABLED: process.env.OPENAI_ENABLED,
  OPENAI_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
  OPENAI_KEY_LENGTH: process.env.OPENAI_API_KEY?.length
});

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin/vaccine-stock', inventoryRoutes);
app.use('/api/admin/sms-logs', smsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin/reports', exportRoutes);
app.use('/api/centers', require('./routes/centerRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Vaccination Management API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
