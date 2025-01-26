const passport = require("passport");
require("../config/passportConfig");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"], prompt: "consent select_account" });

//working source code
const googleCallback = (req, res, next) => {
  console.log("Google callback route reached"); // Add this
  passport.authenticate("google", (err, user, info) => {
    console.log("Inside passport.authenticate"); // Add this
    if (err || !user) {
      console.error("Authentication failed:", err || "No user found");
      return res.redirect("/"); // Redirect to failure page
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return next(loginErr);
      }
      console.log("Login successful. Redirecting to /platform"); // Add this
      return res.redirect(`/platform`);
    });
  })(req, res, next);
};


const logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

module.exports = { googleAuth, googleCallback, logout };
