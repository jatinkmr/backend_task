const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).send('Access Denied !!');
    }

    try {
        const verified = jwt.verify(token, 'RECRUITER_TOKEN_SECRET');
        req.recruiter = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}