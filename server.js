const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const port = process.env.HTTP_PORT || 5000;
const app = express();
app.use(cors());
const router = require('./services/router');
const database = require('./services/database');
const dbConfig = require('./config/database');

// Add 10 threads beyond default 4 for Oracle pool connections 
const defaultThreadPoolSize = 4;
process.env.UV_THREADPOOL_SIZE = dbConfig.testPool.poolMax + defaultThreadPoolSize;

// Logging
app.use(morgan('dev'));

// Router
app.use('/api', router);

// Start Message
console.log('=-=-=-= Starting server! =-=-=-=-=');

// Connect DB Pool
console.log('Connecting to Oracle Database...');
database.initialize()
    .then(() => console.log("Database connected successfully."))
    .catch(err => console.log(err));

// Get / Test
app.get('/', async (req, res) => {
    const result = await database.simpleExecute('select user, systimestamp from dual');
    const user = result.rows[0].USER;
    const date = result.rows[0].SYSTIMESTAMP;
    res.end(`Connect to Oracle DB. Username: ${user}\nDate: ${date}`);
});

// app.get('/', async (req, res) => {
//     res.end('CONNECTED!');
// });

// Start Listening
app.listen(port, () => 
    console.log("Server started, listening on port %s!", port)
);

// // Shutdown
async function shutdown(err) {
    console.log('Server shutting down.');
    if (err)
        console.log(err);
    database.close();
}

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    shutdown();
});


process.on('SIGINT', () => {
    console.log('Received SIGINT');
    shutdown();
});

process.on('uncaughtException', err => {
    console.log('Uncaught Exception');
    console.log(err);
    shutdown(err);
});
