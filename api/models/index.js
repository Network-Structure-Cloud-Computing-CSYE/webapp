require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize')

const dbConfig = require('../config/dbConfig.js')

const sequelize = new Sequelize(

    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)
 


// sequelize.authenticate()
// .then(() => {
//     console.log('connected')
// })
// .catch(error => {
//     console.log('Error: ' + error)
// })

module.exports = sequelize;