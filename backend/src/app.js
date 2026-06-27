const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');
const path = require("path");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));

// Correct frontend build path
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use("/api", foodPartnerRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);

// SPA fallback
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = app;