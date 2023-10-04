const {sequelize, DataTypes} = require('./user')

// const sequelize  = require('../models/index')
// const { DataTypes } = require("sequelize");

// module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
        assignmentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      points: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 10
        }
      },
      num_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      // assignment_created: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW
      // },
      // assignment_updated: {
      //   type: DataTypes.DATE,
      //   defaultValue: DataTypes.NOW
      // }
    }, {

      createdAt: "assignment_created",
      updatedAt: "assignment_updated",
      hooks: {
        beforeUpdate: (assignment, options) => {
          assignment.assignment_updated = new Date();
        }
      }
    });
  
    Assignment.associate = (models) => {
      Assignment.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    };

    module.exports = Assignment;
  
//     return Assignment;
//   };
  