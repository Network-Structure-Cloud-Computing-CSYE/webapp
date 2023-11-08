const atob = require('atob');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).send({ error: 'Authentication failed. Missing Basic auth header.' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = atob(base64Credentials).split(':');
        const [email, providedPassword] = credentials;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send({ error: 'Authentication failed. User not found.' });
        }

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(providedPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Authentication failed. Invalid password.' });
        }

        console.log('Authentication Successful');
        req.user = user;
        next();
    } catch (error) {
        
        res.status(503).send({ error: 'Service Unavailaible' });
    }
};

module.exports = authenticate;
