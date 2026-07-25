const Groq = require('groq-sdk');

const groq = new Groq ({
    apikey: process.env.GROQ_API_KEY
});

module.exports = groq;