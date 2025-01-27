const passport = require("passport");
require("../config/passportConfig");

// const googleAuth = passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" });
const googleAuth = (req, res, next) => {
  const isNewUser = req.query.isNew === "true"; // Check if it's a new user flow
  const prompt = isNewUser ? "consent" : "select_account";
  passport.authenticate("google", { scope: ["profile", "email"], prompt })(req, res, next);
};

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
      return res.redirect(`https://www.totle.co/platform`);
    });
  })(req, res, next);
};


const logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

module.exports = { googleAuth, googleCallback, logout };
