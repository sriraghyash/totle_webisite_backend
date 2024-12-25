const {catalogSequelize} = require('../db/mysql_connect')

module.exports = (catalogSequelize, DataTypes) => {
    return catalogSequelize.define('Category', {
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
    }, {
        timestamps: false, // Disable createdAt and updatedAt fields
    });
};
