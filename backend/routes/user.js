const express = require('express'); //
const userRouter = express.Router(); // Appelle à la fonction Router de Express
const userController = require('../controllers/user'); //

userRouter.post('/signup', userController.userSignUp); // Route POST pour signup
userRouter.post('/login', userController.userLogin); // Route POST pour login

module.exports = userRouter; //

// Def ROUTE : détermine méthode, chemin et fonction pour répondre demande client
// Construction d'une route : app.METHOD(PATH, HANDLER)

// app est une instance d’express.
// METHOD est une méthode de demande HTTP.
// PATH est un chemin sur le serveur.
// HANDLER est la fonction exécutée lorsque la route est mise en correspondance (controller, fonction)