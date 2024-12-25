const { DataTypes } = require('sequelize');
const Education = require('./education')
module.exports = (catalogSequelize) => {
    return catalogSequelize.define('Board', {
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
        educationId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Education',
                key: 'id',
            },
        },
    }, {
        timestamps: false,
    });
};
