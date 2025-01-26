const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { models } = require("../models");
const { User } = models;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://totle-webisite-backend.onrender.com/auth/google/callback",
      prompt: 'select_account', // Force consent screen
      prompt: "consent",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName, emails, name } = profile;
        let user = await User.findOne({ where: { googleId } });

        if (!user) {
          // If user doesn't exist, create one
          const { givenName, familyName } = name;
          const email = emails[0].value;

          user = await User.create({
            googleId,
            firstName: givenName,
            lastName: familyName,
            email,
            isVerified: true
          });
          return done(null, { ...user, isNew: true });
        }
        return done(null, { ...user, isNew: false });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.dataValues.id); // Debugging the user object
  
  // Check if user has a `dataValues` property
  const userId = user.dataValues?.id || user.id;

  if (!userId) {
    return done(new Error("Cannot serialize user: Missing user ID"), null);
  }

  done(null, userId); // Serialize only the user ID into the session
});


passport.deserializeUser(async (id, done) => {
  try {
    console.log('des id',id)
    const user = await models.User.findOne({ where: { id } });
    // console.log(user)
    if (!user) {
      return done(new Error("User not found"));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});


module.exports = passport;
