
module.exports = (catalogSequelize, DataTypes) => {
  // console.log("catalogSequelize in Category model:", !!catalogSequelize);
  if (!catalogSequelize) {
    console.error("catalogSequelize is not provided to the Category model.");
    throw new Error("catalogSequelize is undefined");
  }
  const Category = catalogSequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures category names are unique
        validate: {
          notEmpty: true, // Validates that the name is not empty
          len: [3, 50], // Ensures the length is between 3 and 50 characters
        },
      },
      description: {
        type: DataTypes.STRING, // Optional description
        allowNull: true,
      },
    },
    {
      tableName: "Categories", // Explicit table name
      timestamps: false, // No auto-created timestamps
    }
  );

  return Category;
};
