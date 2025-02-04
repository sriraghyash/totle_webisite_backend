// examPrepsubject.js
module.exports = (catalogSequelize, DataTypes) => {
    return catalogSequelize.define('ExamPrepSubject', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,  // Subject name (Mathematics, Physics, Chemistry, etc.)
      },
      description: {
        type: DataTypes.STRING,  // Optional description for the subject
      },
      examPrepId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ExamPreps',  // Reference to the ExamPrep table
          key: 'id',
        },
      },
    }, {
      timestamps: false,
    });
  };
  