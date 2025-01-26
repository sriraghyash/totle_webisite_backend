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
      // console.log('user',user)

      // Conditional redirection based on whether the user is new
      const { isNew } = user; // Use isNew flag from the strategy
      // console.log("isNew", isNew);
      if (isNew) {
        // console.log("Redirecting to: http://localhost:3000/auth?isNewUser=true?email=" + user.dataValues.email);
        // return res.redirect(`http://localhost:3000/platform`);
        return res.redirect(`/platform`);
      } else {
        // console.log("Redirecting to: http://localhost:3000/teach");
        // return res.redirect("http://localhost:3000/teach");
        return res.redirect("https://www.totle.com/teach");
      }
    })
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

module.exports = { googleAuth, googleCallback, logout };
