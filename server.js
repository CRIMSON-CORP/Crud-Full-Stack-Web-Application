const express = require('express');
const path = require('path');
const router = require('./routes/routes')
const cors = require('cors')

// Express Init
const server = express();
const PORT = process.env.PORT || 2000;

// Express MIddle-ware
server.use(express.static(path.join(__dirname, 'public')));
server.use(router);
server.use(express.json());
server.use(express.urlencoded({
    extended: false
}))
server.use(cors());

// server Init
server.listen(PORT, 'localhost', (err) => {
    if (err) throw err;
    console.log(`Server running on port ${PORT}`);
})