const User = require("../models/user.model");

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

        return res.status(200).json({
            success: true,
            message: "Registration request accepted",
        }).on('finish', () => { 

            console.log(req.body);
        });

        

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