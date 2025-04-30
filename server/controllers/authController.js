import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, surname, username, email, password } = req.body;
    
    if(!name || !surname || !username || !email || !password) {
        return res.json({ succes: false, message: 'All fields are required!' });
    }

    try{
        const userExists = await pool.query('SELECT email FROM cfgvault."USERS" WHERE email = $1', [email]);

        if(userExists.rows.length > 0) {
            return res.json({ success: false, message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query('INSERT INTO cfgvault."USERS" (name, surname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, surname, username, email, hashedPassword]);

        const token = jwt.sign({ id: newUser.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to ConfigVault!',
            text: `Welcome to ConfigVault! Your account has been created with email id: ${email}.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.json({ success: false, message: 'All fields are required!' });
    }
    try {
        const user = await pool.query('SELECT "user_id", "password" FROM cfgvault."USERS" WHERE email = $1', [email]);

        if(user.rows.length === 0) {
            return res.json({ success: false, message: 'User not found!'});
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if(!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials!'});
        }

        const token = jwt.sign({ id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: 'Logged out successfully!' });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try{
        const { userId } = req.body;
        const user = await pool.query('SELECT "isAccountVerified", email FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        if(user.rows[0].isAccountVerified === true){
            return res.json({status: false, message: 'User already verified!'});
        }
        
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpiration = Date.now() + 24 * 60 * 60 * 1000;

        await pool.query('UPDATE cfgvault."USERS" SET "verifyOtp" = $1, "verifyOtpExpireAt" = $2 WHERE user_id = $3 RETURNING *', [otp, otpExpiration, userId]);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.rows[0].email,
            subject: 'Account Verification OTP',
            text: `Your OTP is: ${otp}. Verify your account using this OTP, it is valid for 24 hours.`,
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP sent successfully!' });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const verifyMail = async (req, res) => {
    try{
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.json({ success: false, message: 'All fields are required!' });
        }

        const user = await pool.query('SELECT "verifyOtp", "verifyOtpExpireAt" FROM cfgvault."USERS" WHERE user_id = $1', [userId]);

        if(user.rows[0].length === 0) {
            return res.json({ success: false, message: 'User not found!' });
        }

        if(user.rows[0].verifyOtp === '' || user.rows[0].verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP!' });
        }

        if(user.rows[0].verifyOtpExpireAt < Date.now()){
            return res.json({ success: false, message: 'OTP expired!' });
        }

        await pool.query('UPDATE cfgvault."USERS" SET "isAccountVerified" = $1, "verifyOtp" = $2, "verifyOtpExpireAt" = $3 WHERE user_id = $4', [true, '', 0, userId]);

        res.json({ success: true, message: 'Account verified successfully!' });

    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    try{
        res.json({ success: true });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.json({ success: false, message: 'Email is required!' });
    }
    try{
        const user = await pool.query('SELECT email FROM cfgvault."USERS" WHERE email = $1', [email]);
        
        if(user.rows[0].length === 0) {
            return res.json({ success: false, message: 'User not found!' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpiration = Date.now() + 15 * 60 * 1000;

        await pool.query('UPDATE cfgvault."USERS" SET "resetOtp" = $1, "resetOtpExpireAt" = $2 WHERE email = $3 RETURNING *', [otp, otpExpiration, email]);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.rows[0].email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resseting your password is: ${otp}. Use this OTP to reset your password. It is valid for 15 minutes.`,
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password reset OTP sent successfully!' });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    if(!email || !otp || !password){
        return res.json({ success: false, message: 'All fields are required!' });
    }
    try{
        const user = await pool.query('SELECT "resetOtp", "resetOtpExpireAt" FROM cfgvault."USERS" WHERE email = $1', [email]);

        if(user.rows[0].length === 0) {
            return res.json({ success: false, message: 'User not found!' });
        }

        if(user.rows[0].resetOtp === '' || user.rows[0].resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP!' });
        }

        if(user.rows[0].resetOtpExpireAt < Date.now()){
            return res.json({ success: false, message: 'OTP expired!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE cfgvault."USERS" SET "password" = $1, "resetOtp" = $2, "resetOtpExpireAt" = $3 WHERE email = $4', [hashedPassword, '', 0, email]);

        res.json({ success: true, message: 'Password reset successfully!' });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}
