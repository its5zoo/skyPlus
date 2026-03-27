const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Ensure we always load the server's .env regardless of where node is launched from.
dotenv.config({ path: path.join(__dirname, '.env') });

const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173', // Vite default
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/', weatherRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Weather API is running' }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🌤️  Weather server running on http://localhost:${PORT}`);
});
