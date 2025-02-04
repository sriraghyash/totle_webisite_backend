// examprep.js
module.exports = (catalogSequelize, DataTypes) => {
    return catalogSequelize.define('ExamPrep', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,  // Optional field for description
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',  // Foreign key referencing Category model
          key: 'id',
        },
      },
    }, {
      timestamps: false,
    });
  };
  