// server.js (edited with extra logging)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// --- Database Configuration ---
// IMPORTANT: Replace with your own MySQL credentials
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'MyNewPassword123', // Your actual password
    database: 'alignbox_chat'
};

let dbConnection;

async function connectToDb() {
    try {
        dbConnection = await mysql.createConnection(dbConfig);
        console.log('Successfully connected to the MySQL database. 👍');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        process.exit(1); // Exit if DB connection fails
    }
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// --- API Endpoint to get historical messages ---
app.get('/messages', async (req, res) => {
    try {
        const [rows] = await dbConnection.execute('SELECT * FROM messages ORDER BY timestamp ASC');
        res.json(rows);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).send('Error fetching messages');
    }
});


// --- Socket.IO Real-time Logic ---
io.on('connection', (socket) => {
    console.log('A user connected. 👋');

    socket.on('disconnect', () => {
        console.log('A user disconnected. 🚶');
    });

    // Listen for incoming chat messages
    socket.on('chat message', async (msg) => {
        // --- EDIT 1: Log when a message is received from any client ---
        console.log('✅ Received message on server:', msg);

        try {
            const query = 'INSERT INTO messages (sender_name, message_text, is_anonymous) VALUES (?, ?, ?)';
            const values = [msg.sender_name, msg.message_text, msg.is_anonymous];

            // --- EDIT 2: Log right before writing to the database ---
            console.log('...Attempting to save to database...');
            await dbConnection.execute(query, values);
            console.log('...Message saved successfully!');

            // Broadcast the message to all connected clients
            const [rows] = await dbConnection.execute('SELECT * FROM messages ORDER BY id DESC LIMIT 1');
            
            // --- EDIT 3: Log right before broadcasting back to clients ---
            console.log('...Broadcasting message to all clients:', rows[0]);
            io.emit('chat message', rows[0]);

        } catch (error) {
            // --- This will now catch any error during the process ---
            console.error('❌ ERROR: Failed to save or broadcast message:', error);
        }
    });
});


// --- Start the Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    await connectToDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});