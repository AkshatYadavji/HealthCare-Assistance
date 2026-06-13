const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// 1. IMPORT THE PACKAGES (Fixed: Added the Google library import)
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. INITIALIZE THE AI
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. THE POST API (Sends message, asks AI, saves both)
router.post('/', auth, async (req, res) => {
    try {
        // A. Save User's Message to MongoDB
        const userMessage = new Message({
            text: req.body.text,
            user: req.user.id,
            isBot: false
        });
        await userMessage.save();

        // B. Connect to external Gemini API
       const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are a helpful, professional AI Medical Assistant. 
                        A patient says: "${req.body.text}". 
                        Provide a polite, informative response. Advise them to seek physical medical attention if symptoms seem urgent.`;

        const aiResponse = await model.generateContent(prompt);
        const botText = aiResponse.response.text();

        // C. Save AI's Response to MongoDB
        const botMessage = new Message({
            text: botText,
            user: req.user.id,
            isBot: true // Marked true because the bot generated this
        });
        await botMessage.save();

        // D. Respond to Postman with BOTH messages
        res.json({ user: userMessage, bot: botMessage });

    }catch (err) {
        // 1. FORCE THE TERMINAL TO PRINT THE ENTIRE CRASH DETAILS
        console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log("!!! DETECTED CRITICAL CHAT ROUTE EXCEPTION !!!");
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        
        // This prints the exact file name, line number, and why it broke
        console.error("Full Stack Trace:\n", err.stack || err);
        
        if (err.response) {
            console.error("External API Error Data payload:", err.response.data);
        }
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");

        // 2. Respond back to the frontend with rich json details instead of plain text
        res.status(500).json({ 
            msg: 'Server Error', 
            details: err.message || "No top-level error message string available." 
        });
    }
});

// 4. THE GET API (Fetches history)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find({ user: req.user.id }).sort({ date: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 5. EXPORT THE ROUTER
module.exports = router;