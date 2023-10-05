const fs = require('fs');
const csv = require('csv-parser');
const {User} = require('./api/models/user');
const Assignment = require('./api/models/assignment')
const bcrypt = require('bcrypt');


const app = require('./api/app');
const sequelize = require('./api/models');
require('dotenv').config();

const PORT = `${process.env.PORT}`;




// Function to read and process the CSV file
const processCSV = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream('/opt/user.csv')
          .pipe(csv())
          .on('data', async (row) => {
            try {
              // Hash the password
              const hashedPassword = await bcrypt.hash(row.password, 10); // 10 is the number of salt rounds

              await User.findOrCreate({
                where: { email: row.email },
                defaults: {
                  first_name: row.first_name,
                  last_name: row.last_name,
                  password: hashedPassword
                }
              });
            } catch (error) {
              console.error('Error saving user:', error);
            }
          })
          .on('end', () => {
            console.log('CSV file successfully processed');
            resolve();
          })
          .on('error', (error) => {
            console.error('Error processing CSV file:', error);
            reject(error);
          });
    });
}

// Start the server after processing the CSV
const startServer = async () => {
    try {
        await sequelize.sync();
        await processCSV();
        app.listen(PORT, () => {
            console.log(`running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to process CSV or start the server:', error);
    }
}

startServer();
