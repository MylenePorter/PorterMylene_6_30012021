// Dependencies
const bcrypt = require('bcrypt'); // Librairie qui crypte et décrypte
const jwt = require('jsonwebtoken'); // Librairie pour utilisation token avec la norme 'jwt'
const userModel = require('../models/user'); // Accès pour le modèle 'user'
require('dotenv').config(); // Accès pour récupérer les données dans .env

// Création utilisation
const userSignUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Crypte le 'password' et augmente la complexité à 10
        .then(hash => {
            const user = new userModel({ // Création dans DB de l'utilisateur avec l'email et le mot de passe généré
                email: req.body.email,
                password: hash
            });
            user.save() // Enregistrement de l'utilisateur
                .then(() => res.status(201).json({ message: 'L\'utilisateur a été créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(501).json({ error }));
};

// Connexion utilisateur
const userLogin = (req, res, next) => {
    userModel.findOne({ email: req.body.email }) // Va chercher dans la table 'users' le 'user' correspondant à l'email saisi
        .then(user => {
            if (!user) { // Si l'utilisateur n'est pas trouvé
                return res.status(401).json({ error: 'L\'Utilisateur n\'a pas été trouvé !' }); // Renvoie une erreur avec message
            } else { // Si utilisateur trouvé
                bcrypt.compare(req.body.password, user.password) // Va comparer le mot de passe
                    .then(valid => {
                        if (!valid) { // Si mot de passe invalide
                            return res.status(401).json({ error: 'Le mot de passe est incorrect !' }); // Renvoie une erreur
                        } else {
                            res.status(200).json({ // Requête ok, résultat généré dans objet avec userId + token au format json
                                userId: user._id,
                                // 3 paramètres 'sign' : user, encryption key, duration. 
                                token: jwt.sign({ userId: user._id },
                                    process.env.RANDOM_TOKEN_SECRET, { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(501).json({ error }));
            }
        })
        .catch(error => res.status(501).json({ error }));
};

exports.userSignUp = userSignUp; // Export objet userSignUp en le rendant disponible 
exports.userLogin = userLogin; // Export objet userLogin en le rendant disponible