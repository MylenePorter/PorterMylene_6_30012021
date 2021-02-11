// Dependencies
const express = require('express'); // Server framework pour fonctionnement standardisé
const helmet = require('helmet'); // Protège de certaines vulnérabilités
const bodyParser = require('body-parser'); // Extrait la partie body d'une requête entrante
const mongoose = require('mongoose'); // Permet de communiquer avec MongoDB Atlas
require('dotenv').config(); // Centralise variables environnements 


const app = express(); // Exécution framework
const path = require('path'); // Accéder aux différents répertoires

const userRoutes = require('./routes/user'); // Accès pour route 'user'
const sauceRoutes = require('./routes/sauce'); // Accès pour route 'sauce'

// db MongoDB - Atlas
mongoose.connect( // Données pour connexion à la base de données MongoDB
        'mongodb+srv://' + process.env.DB_USERID + ':' + process.env.DB_PASSWORD + '@cluster0.47ujb.mongodb.net/P6_OC_Porter?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => { //
    // Restriction avec autorisation par url
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_FRONTEND);
    // Restriction des types d'en-tête
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Restriction des types de méthodes utilisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet()); // Couche supplémentaire de sécurité
app.use(bodyParser.json()); // Défini l'utilisation de JSON

app.use('/images', express.static(path.join(__dirname, 'images'))); // Défini le lieu de stockage des images
app.use('/api/auth', userRoutes); // Défini la base pour les routes pour login et signup
app.use('/api/sauces', sauceRoutes); // Défini la base pour les routes sauces

module.exports = app; // Export pour utilisation sur server.js