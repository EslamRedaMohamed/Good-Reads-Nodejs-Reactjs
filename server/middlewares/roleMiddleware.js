const jwt = require('jsonwebtoken');

const roleMiddleware = async (req, res, next) => {
    try{
        const { role } = jwt.verify(req.headers['authorization'], 'key');
        if (role === "admin") {
            console.log('pass to admin side');
            next();
        } else{
            res.status(403).send('Forbidden: You do not have the required permissions.');
        }
    }catch(err){
        res.status(401).send('Access denied');
    }
};

module.exports = roleMiddleware;