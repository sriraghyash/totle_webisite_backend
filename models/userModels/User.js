module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Ensures valid email format
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default is unverified
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true, // Unique identifier for Google authentication
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false, // First name is required
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true, // Last name is optional
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Password is optional (e.g., for OAuth users)
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional user biography
      },
      preferred_language_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "LANGUAGE", // Refers to the Language table
          key: "language_id",
        },
      },
      known_language_ids: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [], // Default is an empty array
      },
      image: {
        type: DataTypes.BLOB("long"),
        allowNull: true, // Profile image (stored as binary data)
      },
      concept_mastery: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0, // Default score
        validate: { min: 0, max: 10 }, // Score between 0 and 10
      },
      accuracy: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      skill_application: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      creativity_expression: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      application_of_knowledge: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      speed: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      problem_solving: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      technical_mastery: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      critical_thinking: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      question_type_proficiency: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      project_completion: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      artistic_process: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      retention: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      exam_strategy: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      adaptability: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      performance_presentation: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      written_verbal_expression: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      syllabus_coverage: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      creativity_innovation: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      feedback_incorporation: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      progress_in_curriculum: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      mock_test_performance: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      certification: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
      portfolio_development: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 10 },
      },
    },
    {
      tableName: "USER",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["email"], // Ensures email is unique
        },
        {
          unique: true,
          fields: ["googleId"], // Ensures Google ID is unique
        },
      ],
    }
  );

  // Associations
  User.associate = (models) => {
    // User has a preferred language
    User.belongsTo(models.Language, {
      foreignKey: "preferred_language_id",
      as: "PreferredLanguage",
    });
  };

  return User;
};
