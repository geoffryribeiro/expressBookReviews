const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

// Parse incoming JSON requests
app.use(express.json());

// Session configuration for customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Middleware to authenticate protected customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
  const authData = req.session.authorization;

  if (authData) {
    const token = authData.accessToken;

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next(); // Proceed to protected route
      } else {
        return res.status(403).json({ message: "User not authenticated." });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in." });
  }
});

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
