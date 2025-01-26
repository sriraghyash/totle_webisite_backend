const passport = require("passport");
require("../config/passportConfig");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"], prompt: "consent select_account" });

//working source code
const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) =>{
    if (err || !user) {
      return res.redirect("/"); // Redirect to failure page
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect(`/platform`);
    })
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

module.exports = { googleAuth, googleCallback, logout };
