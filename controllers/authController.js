const passport = require("passport");
require("../config/passportConfig");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/dashboard",
});

const logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

module.exports = { googleAuth, googleCallback, logout };
