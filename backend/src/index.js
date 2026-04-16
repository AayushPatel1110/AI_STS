import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import userRoutes from './Routes/user.route.js';
import authRoutes from './Routes/auth.route.js';
import adminRoutes from './Routes/admin.route.js';
import ticketRoutes from './Routes/ticket.route.js';
import commentRoutes from './Routes/comment.route.js';
import statsRoutes from './Routes/stats.route.js';
import messageRoutes from './Routes/message.route.js';
import notificationRoutes from './Routes/notification.route.js';
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import { initializeSocket, io, userSocketMap } from './lib/socket.js';

const app = express();
const httpServer = initializeSocket(app);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(clerkMiddleware());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/', (req, res) => res.json({ message: "API is running. Use /api/health for more info." }));

app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));



// Export for other controllers
export { io, userSocketMap };

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Start DB connection after server is up
});
