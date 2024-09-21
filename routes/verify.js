const express = require("express");
const axios = require("axios");
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/unauthorized");
}

// github
router.get("/github", isAuthenticated, async (req, res) => {
  const username = req.user.username;
  const accessToken = req.user.accessToken;
  const targetUsername = "bytemait";

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/following/${targetUsername}`,
      {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 204) {
      // User is following
      req.session.isVerified = true;
      return res.redirect("/private");
    } else {
      // User is not following
      req.session.isVerified = false;
      req.session.notVerifiedAt = "Github";
      return res.redirect("/unauthorized");
    }
  } catch (error) {
    console.error(
      "GitHub API Error:",
      error.response ? error.response.data : error.message
    );
    req.session.isVerified = false;
    req.session.notVerifiedAt = "Github";
    return res.redirect("/unauthorized");
  }
});

// youtube
router.get("/youtube", isAuthenticated, async (req, res) => {
  const accessToken = req.user.accessToken;
  const targetChannelId = "UCgIzTPYitha6idOdrr7M8sQ";

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/subscriptions",
      {
        params: {
          part: "snippet",
          mine: true,
          forChannelId: targetChannelId,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      // User is subscribed
      req.session.isVerified = true;
      return res.redirect("/private");
    } else {
      // User is not subscribed
      req.session.isVerified = false;
      req.session.notVerifiedAt = "Youtube";
      return res.redirect("/unauthorized");
    }
  } catch (error) {
    console.error(
      "YouTube API Error:",
      error.response ? error.response.data : error.message
    );
    req.session.isVerified = false;
    return res.redirect("/unauthorized");
  }
});

module.exports = router;
