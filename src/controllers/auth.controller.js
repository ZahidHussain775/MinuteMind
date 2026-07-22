exports.resgister = (req, res) => {
    res.send('Register User');
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