require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const verifyRoutes = require("./routes/verify");
const privateRoutes = require("./routes/private");

require("./passportSetup");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/verify", verifyRoutes);
app.use("/", privateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
