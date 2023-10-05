const atob = require('atob');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new Error();
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = atob(base64Credentials).split(':');
        const [email, providedPassword] = credentials;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error();
        }

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(providedPassword, user.password);

        if (!isPasswordValid) {
            throw new Error();
        }

        console.log('Authentication Successful');
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed. Please provide valid credentials.' });
    }
};

module.exports = authenticate;
