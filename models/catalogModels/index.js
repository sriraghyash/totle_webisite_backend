// const {catalogSequelize} = require('../../db/mysql_connect');
let { catalogSequelize } = require('../../db/mysql_connect');
// let {cs, sequelize} = require('../../db/mysql_connect')

console.log("catalogSequelize in index file:", !!catalogSequelize);
const { DataTypes } = require('sequelize');

const Category = require('./category')(catalogSequelize, DataTypes);
const Education = require('./education')(catalogSequelize, DataTypes);
const Board = require('./board')(catalogSequelize, DataTypes);
const Grade = require('./grade')(catalogSequelize, DataTypes);
const Subject = require('./subject')(catalogSequelize, DataTypes);
const Topic = require('./topic')(catalogSequelize, DataTypes);

// Define relationships
Category.hasMany(Education, { foreignKey: 'categoryId' });
Education.belongsTo(Category, { foreignKey: 'categoryId' });

Education.hasMany(Board, { foreignKey: 'educationId' });
Board.belongsTo(Education, { foreignKey: 'educationId' });

Board.hasMany(Grade, { foreignKey: 'boardId' });
Grade.belongsTo(Board, { foreignKey: 'boardId' });

Grade.hasMany(Subject, { foreignKey: 'gradeId' });
Subject.belongsTo(Grade, { foreignKey: 'gradeId' });

Subject.hasMany(Topic, { foreignKey: 'subjectId' });
Topic.belongsTo(Subject, { foreignKey: 'subjectId' });

module.exports = { catalogSequelize, Category, Education, Board, Grade, Subject, Topic };
