const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (error, user) => {
    if (error) {
      console.error("❌ Database error:", error);
      return res.status(500).render('login', {
        errors: ['Internal server error'],
        username,
        password
      });
    }

    if (!user) {
      return res.status(400).render('login', {
        errors: ['User not found'],
        username,
        password
      });
    }

    bcrypt.compare(password, user.password, (error, same) => {
      if (error) {
        console.error("❌ Password comparison error:", error);
        return res.status(500).render('login', {
          errors: ['Internal server error'],
          username,
          password
        });
      }

      if (same) {
        req.session.userId = user._id;
        req.session.username = user.username;
        console.log("✅ User logged in:", user.username);
        res.redirect('/');
      } else {
        res.status(401).render('login', {
          errors: ['Invalid password'],
          username,
          password
        });
      }
    });
  });
};
