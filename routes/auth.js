const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user", "user:follow"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/unauthorized" }),
  (req, res) => {
    res.redirect("/verify/github");
  }
);

router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/unauthorized" }),
  (req, res) => {
    res.redirect("/verify/youtube");
  }
);

module.exports = router;
