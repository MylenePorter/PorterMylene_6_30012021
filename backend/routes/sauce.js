// Dependencies
const express = require('express'); // Server framework pour fonctionnement standardisé
const sauceRouter = express.Router(); // Appelle à la fonction Router de Express
const auth = require('../middleware/auth'); // Authentification requise pour chaque utilisation à sauce
const multer = require('../middleware/multer-config'); //
const sauceController = require('../controllers/sauce'); // Accès pour controller 'sauce'

// Différentes Routes
sauceRouter.post('/', auth, multer, sauceController.addSauce); // Route pour ajouter une sauce
sauceRouter.put('/:id', auth, multer, sauceController.modifySauce); // Route pour modifier une sauce
sauceRouter.get('/', auth, sauceController.getAllSauces); // Route pour afficher toutes les sauces
sauceRouter.get('/:id', auth, sauceController.getOneSauce); // Route pour afficher une sauce sélectionner
sauceRouter.delete('/:id', auth, sauceController.deleteSauce); // Route pour effacer une sauce
sauceRouter.post('/:id/like', auth, sauceController.likeSauceStatus); // Route pour aimer avec un like des sauces

module.exports = sauceRouter; // export pour utilisation dans Controllers

// Def ROUTE : détermine méthode, chemin et fonction pour répondre demande client
// Construction d'une route : app.METHOD(PATH, HANDLER)

// app est une instance d’express.
// METHOD est une méthode de demande HTTP.
// PATH est un chemin sur le serveur.
// HANDLER est la fonction exécutée lorsque la route est mise en correspondance (controller, fonction)