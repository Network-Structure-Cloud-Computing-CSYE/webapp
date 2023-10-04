const sequelize  = require('../models/index')

const check = async (req,res) =>  {
console.log(req.query,req.body)
  if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    return res.status(400).send('Bad Request');
}
     
    try {
       const x = await sequelize.authenticate();
      //  console.log(x);
        res.status(200).set('Cache-Control', 'no-cache').end();
      } catch (error) {
        // console.log("ERRRRORRR");
        res.status(503).set('Cache-Control', 'no-cache').end();
      }

}

module.exports = { check }