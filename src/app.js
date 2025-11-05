import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import leadRoutes from './routes/lead.routes.js';
import ApiError from './utils/ApiError.js';

dotenv.config();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic rate limit for public endpoints
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', publicLimiter, authRoutes);
app.use('/api/leads', publicLimiter, leadRoutes);

// Default home route
app.get('/', (req, res) => {
  res.json({
    status: "CRM API is running ✅",
    message: "Welcome to the CRM Backend",
    docs: "/health",
    routes: {
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login"
      },
      leads: {
        publicSubmit: "/api/leads",
        unclaimed: "/api/leads/unclaimed",
        claim: "/api/leads/:id/claim",
        myLeads: "/api/leads/my"
      }
    }
  });
});


// 404
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ success: false, message });
});

export default app;
