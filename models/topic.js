const { DataTypes } = require('sequelize');
const Subject = require('./subject')
module.exports = (catalogSequelize) => {
    return catalogSequelize.define('Topic', {
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
        subjectId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Subjects',
                key: 'id',
            },
        },
    }, {
        timestamps: false,
    });
};
