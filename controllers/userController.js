const User = require("../models/userModels/User");
const {Language} = require("../models/userModels/Language");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const { sendOtp, verifyOtp } = require("../utils/otpUtils");
const { generateToken } = require("../utils/jwtUtils");

const signupUser = async (req, res) => {
    const {
        firstName,
        email,
        // mobile,
        password,
        preferredLanguage,
        lastName,
        knownLanguages,
      } = req.body;
    
      console.log(email)
      try {
        if (!firstName)
          return res
            .status(400)
            .json({ error: true, message: "First name is required" });
        if (!email)
          return res
            .status(400)
            .json({ error: true, message: "Email is required" });
        if (!password)
          return res
            .status(400)
            .json({ error: true, message: "Password is required" });
        if (!preferredLanguage)
          return res
            .status(400)
            .json({ error: true, message: "Preferred language is required" });
        if (!Array.isArray(knownLanguages)) {
          return res
            .status(400)
            .json({ error: true, message: "Known languages must be an array" });
        }
    
        // Check if user already exists by email or username
        const existingUser = await User.findOne({ where: { email } });
    
        if (existingUser) {
          return res.status(403).json({
            error: true,
            message: "User with this email exists",
          });
        }
    
        // Log preferred language for debugging
        // console.log("Preferred Language Provided:", preferredLanguage);
    
        // Fetch the preferredLanguage_id based on the provided language name
        const language = await Language.findOne({
          where: { language_id: preferredLanguage },
        });
        // console.log(language)
    
        if (!language) {
          return res.status(400).json({
            error: true,
            message: "Preferred language not found",
          });
        }
    
        // const preferredLanguage_id = language.language_id;
    
        const validLanguages = await Language.findAll({
          where: { language_id: knownLanguages },
          attributes: ["language_id"],
        });
    
        if (validLanguages.length !== knownLanguages.length) {
          return res
            .status(400)
            .json({ error: true, message: "Some known languages are invalid" });
        }
    
        const result= await sendOtp(email);
        if (result.error) {
          return res.status(400).json({ error: true, message: result.message });
        } else {
          return res.status(200).json({ message: result.message });
        }
        
      } catch (error) {
        console.error("Error during signup: ", error);
        return res.status(500).json({
          error: true,
          message: "Internal Server Error",
        });
      }
};
  
const verifySignup = async (req, res) => {
    const {email, otp, firstName, password, preferredLanguage, lastname, knownLanguages} = req.body;
    try {
      const result = await verifyOtp(email, otp);
      if (result.error) {
        return res.status(400).json({ error: true, message: result.message });
      } 
      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastname,
        preferred_language_id: preferredLanguage,
        known_language_ids: knownLanguages,
      });
      return res.status(201).json({ error: false, message: "User created successfully" });
    } catch (error) {
      return res.status(400).json({ error: true, message: " Internal server error"})
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

  // Ensure either email or username is provided
  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter your email" });
  }

  // Ensure password is provided
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter your password" });
  }

  try {
    // Query to find user by either email or username
    const existingUser = await User.findOne({ where: { email } });

    // If no user is found, return an error
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User doesn't exist, please register" });
    }
    // Validate password using bcrypt
    const match = await comparePassword(password, existingUser.password);
    if (!match) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid login credentials" });
    }

    // Generate JWT token for the user
    const token = generateToken(existingUser);

    const user = await User.findOne({
      where: { email }, // Replace with the actual email
      attributes: ["id","preferred_language_id", "known_language_ids"],
    });

    const preferredLanguage = await Language.findOne({
      where: { language_id: user.preferred_language_id },
    });

    const knownLanguages = await Language.findAll({
      where: { language_id: user.known_language_ids },
    });

    const userData = {
      userid:user.id,
      firstName: existingUser.firstName,
      lastname: existingUser.lastname,
      email: existingUser.email,
      preferredLanguage,
      knownLanguages// Include known languages, default to empty array
    };

    return res.status(200).json({error:false, message: "Login successful", token, user: userData });
  } catch (error) {
    console.error("Error during login: ", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: true, message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal server error" });
    }
};
  
const updateUser = async (req, res) => {
const { userId } = req.params;
const { firstName, lastname, email, preferred_language_id, known_language_ids } = req.body;
try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: true, message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.preferred_language_id = preferred_language_id || user.preferred_language_id;
    user.known_language_ids = known_language_ids || user.known_language_ids;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
} catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
}
};
  
module.exports = { signupUser, verifySignup, loginUser, getUserById, updateUser };
