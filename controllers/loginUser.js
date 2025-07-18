const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username }, (error, user) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).send("Internal server error");
        }

        if (!user) {
            return res.status(400).send("User not found");
        }

        bcrypt.compare(password, user.password, (error, same) => {
            if (error) {
                console.error("Password comparison error:", error);
                return res.status(500).send("Internal server error");
            }

            if (same) { // If passwords match
                req.session.userId = user._id;  //  Store user ID in session
                req.session.username = user.username;  //  Store username in session
                console.log("User logged in:", user.username);
                res.redirect('/');
            } else {
                res.status(401).send("Invalid password");
            }
        });
    });
};