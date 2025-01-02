const { DataTypes } = require('sequelize');
const Grade = require('./grade')
module.exports = (catalogSequelize) => {
    return catalogSequelize.define('Subject', {
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
            type: DataTypes.STRING, // Add the description field
        },
        gradeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Grades',
                key: 'id',
            },
        },
    }, {
        timestamps: false,
    });
};
