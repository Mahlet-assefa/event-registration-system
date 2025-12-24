const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth-routes');

const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, '../../server.log');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    const msg = `REQ: ${req.method} ${req.url}\n`;
    fs.appendFileSync(LOG_FILE, msg);
    console.log(msg.trim());
    next();
});

console.log('Mounting /api/v1/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);
console.log('Routes mounted');

app.get('/', (req, res) => {
    res.send('Event Registration System API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
