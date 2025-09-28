# Alignbox Chat Application Assignment

This is a full-stack chat application built with HTML, CSS, JavaScript, Node.js, and MySQL.

## How to Run

1.  **Clone the repository:**
    `git clone https://github.com/YourUsername/alignbox-chat-assignment.git`

2.  **Install dependencies:**
    `cd alignbox-chat-assignment`
    `npm install`

3.  **Set up the database:**
    Connect to your MySQL instance and run the following SQL script to create the database and the necessary table.

    ```sql
    -- Create the database if it doesn't exist
    CREATE DATABASE IF NOT EXISTS alignbox_chat;

    -- Use the newly created database
    USE alignbox_chat;

    -- Create the messages table
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_name VARCHAR(50) NOT NULL,
        message_text TEXT NOT NULL,
        is_anonymous BOOLEAN DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- (Optional) Insert some dummy data to match the UI
    INSERT INTO `messages` (`sender_name`, `message_text`, `is_anonymous`) VALUES
    ('Anonymous', 'Someone order Bornvita!!', 1),
    ('Anonymous', 'hahahahah!!', 1),
    ('Anonymous', 'I\'m Excited For this Event! Ho-ho', 1);
    ```

4.  **Update Database Credentials:**
    In `server.js`, update the `dbConfig` object with your MySQL username and password.

5.  **Start the server:**
    `node server.js`

6.  **Open in your browser:**
    Navigate to `http://localhost:3000`
