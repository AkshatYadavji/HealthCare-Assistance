const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('../models/User');
const auth = require('../middleware/auth');
 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        
        user = new User({ name, email, password });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
        // --- ADDED: Generate token immediately on registration ---
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                // We send both the token and the message back to the frontend
                res.json({ 
                    token, 
                    msg: "User Registered and Logged In Successfully" 
                });
            }
        );
        // ---------------------------------------------------------
    }
    catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).send('Server error');
    }
});
router.post('/login',async(req,res)=>{
    const { email,password}= req.body;
    try{
        let user = await User.findOne({email});
        if(!user) return res.status(400).json({msg:"Invalid Credentials"});
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg : 'Invalid Password'});
        
        const payload = {
            user :{
                id:user.id
            }
        };
        jwt.sign(
            payload ,
            process.env.JWT_SECRET,
            {expiresIn : '1h'},
            (err,token)=> {
                if(err)throw err;
                res.json({token,
                    msg : 'Login Successful',
                    userId:user.id
                });
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server Error');
    }
});
module.exports = router;