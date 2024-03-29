const jwt = require('jsonwebtoken');
const User = require('../../models/user');


const requireAuth = (req, res, next) => {
    const token = req.headers.jwt;

    //check json web token exist & is verified
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.status(401).send({ Error: 'Access token is invalid'})
            } else {
                next();
            }
        });
    } 
    else {
        res.status(401).send({ Error: 'Access token is missing'})
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.headers.jwt;

    if (token) {
     jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = {
    requireAuth,
    checkUser
};