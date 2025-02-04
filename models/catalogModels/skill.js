// skill.js
module.exports = (catalogSequelize, DataTypes) => {
    return catalogSequelize.define('Skill', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,  // Skill name (e.g., "Mathematical Skills")
      },
      description: {
        type: DataTypes.STRING,  // Optional description for the skill
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',  // Reference to the Category table
          key: 'id',
        },
      },
    }, {
      timestamps: false,
    });
  };
  