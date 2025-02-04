const { sequelize } = require('../db/mysql_connect');
const { DataTypes } = require("sequelize");
const {catalogSequelize} = require('../db/mysql_connect')
const Language = require('./userModels/Language')(sequelize, DataTypes);
const Otp = require('./userModels/Otp')(sequelize, DataTypes);
const User = require('./userModels/User')(sequelize, DataTypes);
const Category = require("./catalogModels/category")(catalogSequelize, DataTypes);
const Education = require("./catalogModels/education")(catalogSequelize, DataTypes);
const Board = require("./catalogModels/board")(catalogSequelize, DataTypes);
const Grade = require("./catalogModels/grade")(catalogSequelize, DataTypes);
const Subject = require("./catalogModels/subject")(catalogSequelize, DataTypes);
const Topic = require("./catalogModels/topic")(catalogSequelize, DataTypes);
const ExamPrep = require("./catalogModels/examPrep")(catalogSequelize, DataTypes);
const ExamPrepSubject = require('./catalogModels/examPrepSubject')(catalogSequelize, DataTypes);
const ExamPrepTopic = require('./catalogModels/examPreptopic')(catalogSequelize, DataTypes);
const Skill = require('./catalogModels/skill')(catalogSequelize, DataTypes);


// Define relationships for Catalog DB
Category.hasMany(Education, { foreignKey: "categoryId" });
Education.belongsTo(Category, { foreignKey: "categoryId" });

Education.hasMany(Board, { foreignKey: "educationId" });
Board.belongsTo(Education, { foreignKey: "educationId" });

Board.hasMany(Grade, { foreignKey: "boardId" });
Grade.belongsTo(Board, { foreignKey: "boardId" });

Grade.hasMany(Subject, { foreignKey: "gradeId" });
Subject.belongsTo(Grade, { foreignKey: "gradeId" });

Subject.hasMany(Topic, { foreignKey: "subjectId" });
Topic.belongsTo(Subject, { foreignKey: "subjectId" });

// Define relationships for Catalog DB...
Category.hasMany(ExamPrep, { foreignKey: 'categoryId' });
ExamPrep.belongsTo(Category, { foreignKey: 'categoryId' });

ExamPrep.hasMany(ExamPrepSubject, { foreignKey: 'examPrepId' });
ExamPrepSubject.belongsTo(ExamPrep, { foreignKey: 'examPrepId' });

ExamPrepSubject.hasMany(ExamPrepTopic, { foreignKey: 'examPrepSubjectId' });
ExamPrepTopic.belongsTo(ExamPrepSubject, { foreignKey: 'examPrepSubjectId' });

// Category.hasMany(Skill, { foreignKey: 'categoryId' });
// Skill.belongsTo(Category, { foreignKey: 'categoryId' });

const models = { 
    Language,
    Otp,
    User,
    Category,
    Education,
    Board,
    Grade,
    Subject,
    Topic,
    ExamPrep,
    ExamPrepSubject,
    ExamPrepTopic,
    Skill
 };

module.exports = { sequelize, models };
