
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('hayispure', 'hayispure1', 'Administrator')");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route for handling login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if the username and password match a record in the database
    db.get("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            console.log('Error', err);
            return res.redirect("/index.html#error");
        }
        if (!row) {
           //Invalid credentials
            res.redirect("/index.html#unauthorized");
        } else {
            // Successful login 
            res.send('Hello <b>' + row.title + '!</b><br />This file contains all your secret data: <br /><br />SECRETS <br /><br /> MORE SECRETS <br /><br /><a href="/index.html">Go back to login</a>');
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

