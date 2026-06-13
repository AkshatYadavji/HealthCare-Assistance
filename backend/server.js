const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/chat', require('./routes/chat'));


app.get('/',(req,res)=>{
    res.send("Healthcare Server is Running");
});

const PORT = process.env.PORT || 5000;
console.log("My URI is:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
 .then(()=>console.log(" COnnected to Server"))
 .catch((err) => console.log("Connecction Error : " ,err));

// GLOBAL ERROR LOGGER MIDDLEWARE (Place this right before app.listen)
app.use((err, req, res, next) => {
    console.log("!!! GLOBAL BACKEND EXCEPTION CAUGHT !!!");
    console.error("Error Message:", err.message);
    console.error("Full Error Stack Trace:", err.stack);
    
    // Ensure the frontend still gets a response so it doesn't hang indefinitely
    if (!res.headersSent) {
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
});

app.listen(PORT , () => {
    console.log(` Server is running on PORT ${PORT}`);
});