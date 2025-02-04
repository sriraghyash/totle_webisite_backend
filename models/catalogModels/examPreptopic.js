// examPreptopic.js
module.exports = (catalogSequelize, DataTypes) => {
    return catalogSequelize.define('ExamPrepTopic', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,  // Topic name (e.g., Algebra, Mechanics)
      },
      description: {
        type: DataTypes.STRING,  // Optional description for the topic
      },
      examPrepSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ExamPrepSubjects',  // Reference to the ExamPrepSubject table
          key: 'id',
        },
      },
    }, {
      timestamps: false,
    });
  };
  