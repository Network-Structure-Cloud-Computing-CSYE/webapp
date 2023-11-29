const {sequelize, DataTypes} = require('./user')

const logger = require('../../logger/index'); 
// const logger = require('../utils/logger');
 
// const sequelize = SequelizeFactory().get();
 
const UserSubmissions = sequelize.define('User_Submissions', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  submissionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
 
(async() => {
   try{
      await sequelize.sync()
      console.log("Successfully synced 'user_submission' Table");
      logger.info('ORM: Successfully synced "user_submission" table');
   }catch(error){
      logger.error('ORM: Error syncing "user_submission" table');
      console.log("Error syncing 'user_submission' Table")
   }
})()
 
module.exports = UserSubmissions;