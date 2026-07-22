const app = require('./app');

require('dotenv').config();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const startServer = async() => {

    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });


}

startServer();