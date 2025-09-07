// File: app.js

import cors from 'cors';
import fs from 'fs';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import express from 'express';
import connection from './config/db.js';
import './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import saleFormRoutes from './routes/saleFormRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import BuyNewCarFormRoutes from './routes/BuyNewCarFormRoutes.js'
import Razorpay from "razorpay";
import bodyParser from 'body-parser';

// const express = require('express');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.static('uploads'));
app.use(bodyParser.json());

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // Replace with real Razorpay key_id
  key_secret: process.env.RAZORPAY_SECRET,   // Replace with real Razorpay key_secret
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Create uploads directory if missing
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Connect DB
connection();

// Routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/saleForm', saleFormRoutes);
app.use('/buyNewCarForm', BuyNewCarFormRoutes);
app.use('/payments', paymentRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
