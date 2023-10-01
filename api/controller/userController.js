const sequelize  = require('../models/index')


const check = async (req,res) =>  {

   
     
    try {
       const x = await sequelize.authenticate();
       console.log(x);
        res.status(200).set('Cache-Control', 'no-cache').end();
      } catch (error) {
        console.log("ERRRRORRR");
        res.status(503).set('Cache-Control', 'no-cache').end();
      }

}

module.exports = { check }