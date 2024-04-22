const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoute = require('./routes/userRoute');
const profileRoute = require('./routes/profileRoute');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', userRoute);
app.use('/api/profile', profileRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected')
        app.get('/', (res) => {
            res.json({ message: 'API is working' });
        })
    }
    )
    .catch(err => {
        app.get('/', (res) => {
            res.json({
                message:
                    'API is not working. MongoDB connection failed. Please check the connection string.'
            });
        })
    }
    );

// Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

// Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})