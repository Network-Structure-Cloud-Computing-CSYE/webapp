const winston = require('winston');
 
const  productionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
   new winston.transports.Console(), // Log to the console
   new winston.transports.File({ filename: '/home/csye6225/csye6225.log'}), // Log errors to a file
 ],
});
 
module.exports =  productionLogger;