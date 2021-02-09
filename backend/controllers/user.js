const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
require('dotenv').config();


const userSignUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new userModel({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'L\'utilisateur a été créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(501).json({ error }));
};

const userLogin = (req, res, next) => {
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'L\'Utilisateur n\'a pas été trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Le mot de passe est incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            process.env.RANDOM_TOKEN_SECRET, { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(501).json({ error }));
        })
        .catch(error => res.status(501).json({ error }));
};

exports.userSignUp = userSignUp;
exports.userLogin = userLogin;