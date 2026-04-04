import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './Routes/user.route.js';
import authRoutes from './Routes/auth.route.js';
import adminRoutes from './Routes/admin.route.js';
import ticketRoutes from './Routes/ticket.route.js';
import statsRoutes from './Routes/stats.route.js';
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';  
import cors from 'cors';
dotenv.config();

connectDB();

const app = express();
app.use(cors(
  {
    origin: 'http://localhost:3000', 
    credentials: true,
  }
));
app.use(clerkMiddleware());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/tickets', ticketRoutes); 
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});