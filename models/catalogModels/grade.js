const { DataTypes } = require('sequelize');
const Board = require('./board')
module.exports = (catalogSequelize) => {
    return catalogSequelize.define('Grade', {
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
        boardId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Boards',
                key: 'id',
            },
        },
    }, {
        timestamps: false,
    });
};
