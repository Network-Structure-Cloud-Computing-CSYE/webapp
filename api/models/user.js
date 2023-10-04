const sequelize  = require('../models/index')
const { DataTypes } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      // account_created: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW
      // },
      // account_updated: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW
      // }
    }, { 
      createdAt: "account_created",
      updatedAt: "account_created",
      hooks: {
        beforeUpdate: (user, options) => {
          user.account_updated = new Date();
        }
      }
    });
  
    User.associate = (models) => {
      User.hasMany(models.Assignment, {
        foreignKey: 'assignmentId',
        as: 'assignments'
      });
    };

    module.exports = {User, sequelize, DataTypes };
    // module.exports = User;
  
    // return User;
//   };
  
 