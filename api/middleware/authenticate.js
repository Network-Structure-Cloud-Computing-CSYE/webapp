const atob = require('atob');  // Add this to the top of your file to decode base64
const {User} = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new Error();
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = atob(base64Credentials).split(':');
        const [email, password] = credentials;

        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) {
            throw new Error();
        }
        console.log('Authentication Successfull')
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed. Please provide valid credentials.' });
    }
};

module.exports = authenticate;
