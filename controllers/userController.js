const { models } = require("../models");
const { User } = models;

const {Language,Otp} = models;
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const { sendOtp, verifyOtp } = require("../utils/otpUtils");
const { generateToken } = require("../utils/jwtUtils");

const signupUserAndSendOtp = async (req, res) => {
    const {
        // firstName,
        email,
        // mobile,
        password,
        // preferredLanguage,
        // lastName,
        // knownLanguages,
      } = req.body;
    
      console.log(email)
      try {
        // if (!firstName)
        //   return res
        //     .status(400)
        //     .json({ error: true, message: "First name is required" });
        if (!email)
          return res
            .status(400)
            .json({ error: true, message: "Email is required" });
        if (!password)
          return res
            .status(400)
            .json({ error: true, message: "Password is required" });
        // if (!preferredLanguage)
        //   return res
        //     .status(400)
        //     .json({ error: true, message: "Preferred language is required" });
        // if (!Array.isArray(knownLanguages)) {
        //   return res
        //     .status(400)
        //     .json({ error: true, message: "Known languages must be an array" });
        // }
    
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
        // const language = await Language.findOne({
        //   where: { language_id: preferredLanguage },
        // });
        // console.log(language)
    
        // if (!language) {
        //   return res.status(400).json({
        //     error: true,
        //     message: "Preferred language not found",
        //   });
        // }
    
        // const preferredLanguage_id = language.language_id;
    
        // const validLanguages = await Language.findAll({
        //   where: { language_id: knownLanguages },
        //   attributes: ["language_id"],
        // });
    
        // if (validLanguages.length !== knownLanguages.length) {
        //   return res
        //     .status(400)
        //     .json({ error: true, message: "Some known languages are invalid" });
        // }
    
        const otpResponse= await sendOtp(email);
        console.log('otpResponse',otpResponse)
        if (otpResponse.error) {
          return res.status(400).json({ error: true, message: otpResponse.message });
        }
        req.session.tempUser = { email, password };
        return res.status(200).json({ error: false, message: otpResponse.message });
      } catch (error) {
        console.error("Error during signup: ", error);
        return res.status(500).json({
          error: true,
          message: "Internal Server Error",
        });
      }
};

const completeSignup = async (req, res) => {
  const { preferredLanguage, knownLanguages } = req.body;

  if (!preferredLanguage || !Array.isArray(knownLanguages)) {
      return res.status(400).json({ error: true, message: "Languages are required." });
  }

  try {
      const tempUser = req.session.tempUser;
      if (!tempUser || tempUser.email ) {
          return res.status(400).json({ error: true, message: "User Details are unavailable !!!" });
      }

      // Create user record
      let preferredLanguage = await models.Language.findOne({ where: { language_id: preferredLanguage } });
      if (!preferredLanguage) {
        return res.status(400).json({ error: true, message: "Preferred language not found." });
      }
      
      const knownLanguages = await models.Language.findAll({ 
        where: { language_id: knownLanguages },
        attributes: ["language_id"]
      });
      
      if (knownLanguages.length !== knownLanguages.length) {
        return res.status(400).json({ error: true, message: "One or more known languages are invalid." });
      }
      const hashedPassword = await hashPassword(tempUser.password);
      await models.User.create({
        email: tempUser.email,
        password: hashedPassword,
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        preferred_language_id: preferredLanguage,
        known_language_ids: knownLanguages,
    });
      req.session.tempUser = null;
      return res.status(201).json({ error: false, message: "User registered successfully." });
  } catch (error) {
      console.error("Error during final registration:", error);
      return res.status(500).json({ error: true, message: "Internal server error." });
  }
};


const sassyMessages = [
  "Chill out! Your OTP is valid for another ${minutes}m ${seconds}s. It’s not going anywhere—just check your inbox!",
  "Slow down, superstar. That OTP we sent is still valid for ${minutes}m ${seconds}s. No need to rush it!",
  "Take a deep breath! Your OTP is hanging out in your inbox, good for another ${minutes}m ${seconds}s. Give it some love!",
  "You’ve already got an OTP, and it’s still valid for ${minutes}m ${seconds}s. You’re not ghosting it, are you?",
  "Hey, your OTP is fine. It’s valid for ${minutes}m ${seconds}s. No need to break up with it just yet!",
  "Relax, Totler! That OTP we sent is good for ${minutes}m ${seconds}s. Stop stressing my server and check your inbox.",
  "Your OTP is alive and well, valid for ${minutes}m ${seconds}s. Don’t abandon it like yesterday’s leftovers!",
  "Whoa, hold up! Your OTP is valid for another ${minutes}m ${seconds}s. No need to hit resend like it owes you money.",
  "Bro, your OTP is still valid for ${minutes}m ${seconds}s. Check your inbox—it’s waiting for you like a Brother from another mother.",
  "Your OTP is hanging in there, valid for ${minutes}m ${seconds}s. Don’t give it the cold shoulder!"
];

const resetUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  try {
    // Check if an OTP exists for the given email
    const otpRecord = await Otp.findOne({ where: { email } });
    console.log(otpRecord)

    if (otpRecord) {
      const randomIndex = Math.floor(Math.random() * sassyMessages.length);
      // Check if the OTP has expired
      const timeRemaining = Math.round((otpRecord.expiry - new Date()) / 1000); // Time remaining in seconds
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      // Replace placeholders with actual minutes and seconds
      const message = sassyMessages[randomIndex].replace("${minutes}", minutes)
                      .replace("${seconds}", seconds);
      if (new Date() < otpRecord.expiry) {
        console.log('true')
        return res.status(200).json({
          error: false,
          message: message,
        });
      }
    }

    // Send a new OTP if no valid OTP exists or if it's expired
    const result = await sendOtp(email);

    if (result.error) {
      return res.status(500).json({ error: true, message: result.message });
    }

    return res.status(200).json({ error: false, message: result.message });
  } catch (error) {
    console.error("Error during OTP reset: ", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const otpVerification = async(req,res) => {
  const { email, otp } = req.body;
  console.log('email',email, 'otp',otp)
  if (!email || !otp) {
    return res.status(400).json({ error: true, message: "Email and OTP are required" });
  }
  try {
    const result = await verifyOtp(email, otp);
    if (result.error) {
      return res.status(400).json({ error: true, message: result.message });
    } else {
      req.session.tempUser.isVerified = true;
      console.log('result',result.message)
      return res.status(200).json({error: false, message: result.message });
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ error: true, message: "Internal server error." });
  }
  
}

// Reset Password Endpoint
const resetPassword= async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email)

  if (!email || !newPassword) {
    return res.status(400).json({ error: true, message: 'Email and new password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const verifySignup = async (req, res) => {
    const {email, otp} = req.body;
    try {
      const result = await verifyOtp(email, otp);
      if (result.error) {
        return res.status(400).json({ error: true, message: result.message });
      }
      req.session.tempUser.isVerified = true;
      return res.status(200).json({ error: false, message: "OTP verified successfully." });
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
const upduser= async (req, res) => {
  const { userId } = req.params;
  const {
    firstname,
    lastname,
    email,
    mobile,
    preferred_language_id,
    known_language_ids,
  } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Update user profile fields if provided in the request body
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (preferred_language_id !== undefined) {
      const preferredLanguage = await Language.findOne({
        where: { language_id: preferred_language_id },
      });

      if (!preferredLanguage) {
        return res.status(400).json({
          error: true,
          message: "Invalid preferred language ID",
        });
      }
      user.preferred_language_id = preferred_language_id;
    }

    if (known_language_ids !== undefined) {
      const knownLanguages = await Language.findAll({
        where: { language_id: known_language_ids },
      });

      if (knownLanguages.length !== known_language_ids.length) {
        return res.status(400).json({
          error: true,
          message: "One or more known language IDs are invalid",
        });
      }
      user.known_language_ids = known_language_ids;
    }
    if (req.file) {
      user.image = req.file.buffer;
    }


    // Save the updated user profile
    await user.save();

    // Fetch updated preferred and known languages for response
    const updatedPreferredLanguage = await Language.findOne({
      where: { language_id: user.preferred_language_id },
      attributes: ["language_name"],
    });

    const updatedKnownLanguages = await Language.findAll({
      where: { language_id: user.known_language_ids },
      attributes: ["language_name"],
    });

    const updatedKnownLanguageNames = updatedKnownLanguages.map(
      (lang) => lang.language_name
    );

    // Prepare the response data
    const responseData = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      preferredLanguage: updatedPreferredLanguage?.language_name || "Unknown",
      knownLanguages: updatedKnownLanguageNames,
      image: user.image ? user.image.toString("base64") : null,
    };

    // Send the response
    return res.status(200).json({
      message: "User profile updated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating user information: ", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
  
module.exports = { signupUserAndSendOtp, verifySignup, loginUser, getUserById, updateUser, resetUser, resetPassword, otpVerification, upduser,completeSignup };
