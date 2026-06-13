const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    console.log("\n--- [AUTH MIDDLEWARE] Incoming Request Detected ---");
    
    // Get token from header
    const token = req.header('x-auth-token');
    console.log("Token Received from frontend:", token ? "📦 Token Present" : "❌ NO TOKEN IN HEADERS");

    // Check if no token
    if (!token) {
        console.log("Auth Status: Rejected (Missing Token)");
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token signature
    try {
        console.log("Attempting to verify JWT token signature...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded.user;
        console.log("Auth Status: ✅ SUCCESS! User authorized ID:", req.user.id);
        next();
    } catch (err) {
        console.log("!!! AUTH MIDDLEWARE CRASH DETECTED !!!");
        console.error("Auth Error Stack Trace:\n", err.stack || err);
        
        res.status(500).json({ 
            msg: 'Token validation error or middleware failure', 
            details: err.message 
        });
    }
};