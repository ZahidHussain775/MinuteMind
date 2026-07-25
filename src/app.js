const express = require('express');
const authRoutes  = require('./routes/auth.routes');


const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/meetings', require('./routes/meeting.routes'));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;