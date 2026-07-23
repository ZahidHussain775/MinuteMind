const User   = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body; // already validated + normalized by Zod middleware

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }
        const hashpassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            email,
            password: hashpassword
        })

        const token = jwt.sign(
            {
                id: newUser._id}
                ,process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRES_IN}
    )

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token
            }
        })        

    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.login = (req, res) => {
    res.send('Login User');
};

exports.logout = (req, res) => {
    res.send('Logout User');
};

exports.getMe = (req, res) => {
    res.send('Current User');
};