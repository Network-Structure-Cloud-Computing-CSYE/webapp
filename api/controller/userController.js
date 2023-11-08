const sequelize  = require('../models/index')
const client = require('../../metrics/index'); 
const logger = require('../../logger/index'); 

const check = async (req,res) =>  {
console.log(req.query,req.body)
  if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    logger.error('Health Check - Bad Request: Unexpected query parameters or body content');
    client.increment('healthz.badRequest');
    return res.status(400).send('Bad Request');
}
     
    try {
       const x = await sequelize.authenticate();
      //  console.log(x);
      logger.info('Health Check - Success');
      client.increment('healthz.success');
        res.status(200).set('Cache-Control', 'no-cache').end();
      } catch (error) {
        // console.log("ERRRRORRR");
        logger.error(`Health Check - Service Unavailable: ${error.message}`);
        client.increment('healthz.serviceUnavailable');
        res.status(503).set('Cache-Control', 'no-cache').end();
      }

}

module.exports = { check }