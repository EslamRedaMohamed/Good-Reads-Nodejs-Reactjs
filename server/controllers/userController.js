const User = require('./../models/User');
const cryptoJs = require("crypto-js");
const jwt = require('jsonwebtoken');

const secretKey = 'g2KAymsdGCulp2nq0kSpEqO5yZb2dbktbGyjFc9AQSfviiO7if4FtQ+9ns3EsJtK';


const createUser = async (req, res) => {
    const { firstName, lastName, email, username, password, role } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    const user = new User({ firstName, lastName, email, image, username, password, role });

    try{
        const createUser = await user.save();
        res.send(createUser);
    } catch{
        res.status(400).send('Error creating user');
    }
};



const verifyUser = async (req, res) => {
    const { username, password} = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).send('user name not found');

        const decryptedPass = cryptoJs.AES.decrypt(user.password, secretKey);
        if (password === decryptedPass.toString(cryptoJs.enc.Utf8)) {
            return res.send({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                username: user.username,
                role: user.role,
                token: jwt.sign({ _id: user._id,role: user.role }, 'key')
            });
        }

        res.status(401).send('Un Authenticated');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error verifying user');
    }
};



module.exports = { createUser, verifyUser };

