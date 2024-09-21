const express = require("express");
const router = express.Router();

function ensureVerified(req, res, next) {
  if (req.isAuthenticated() && req.session.isVerified) {
    return next();
  }
  res.redirect("/unauthorized");
}

router.get("/private", ensureVerified, (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Private Page</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <h1>Welcome, ${req.user.displayName || req.user.username}!</h1>
        <p>This is the private content only accessible to verified users.</p>
        <a href="/logout">Logout</a>
      </body>
    </html>
  `);
});

router.get("/unauthorized", (req, res) => {
  const socialLink =
    req.session.notVerifiedAt === "Github"
      ? "https://github.com/bytemait"
      : "https://www.youtube.com/@BYTE-mait";
  const notVerifiedMessage = req.session.notVerifiedAt
    ? `<p>You are not following us on ${req.session.notVerifiedAt}.</p>
       <p>Please follow/subscribe at <a href=${socialLink}>${req.session.notVerifiedAt}</a> and try again.</p>`
    : "<p>Some Error Occured during process.</p><p>Please Try Again.</p>";
  res.send(`
    <html>
      <head>
        <title>Access Denied</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <h1>Access Denied</h1>
        ${notVerifiedMessage}
        <a href="/login">Return to Login</a>
      </body>
    </html>
  `);
});

router.get("/login", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <h1>Select Authentication Method</h1>
        <a href="/auth/github">Login with GitHub</a><br/>
        <a href="/auth/google">Login with Google</a>
      </body>
    </html>
  `);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
