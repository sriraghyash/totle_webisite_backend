module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define(
    "Otp",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures each email can only have one OTP record
        validate: {
          isEmail: true, // Validates that the value is a proper email address
        },
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true, // Validates that the value is an integer
        },
      },
      expiry: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "OTP", // Optional: custom table name
      timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
  );

  return Otp;
};
