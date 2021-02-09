// Dependencies
const express = require('express'); // Server framework
const helmet = require('helmet'); // Protège de certaines vulnérabilités
const bodyParser = require('body-parser'); // Extrait la partie body d'une requête entrante
const mongoose = require('mongoose'); // Permet de communiquer avec MongoDB Atlas
require('dotenv').config(); // Centralise variables environnements 


const app = express(); // Exécution framework
const path = require('path'); // Accéder aux différents répertoires

const userRoutes = require('./routes/user'); //
const sauceRoutes = require('./routes/sauce'); //

// db MongoDB - Atlas
mongoose.connect( //
        'mongodb+srv://' + process.env.DB_USERID + ':' + process.env.DB_PASSWORD + '@cluster0.47ujb.mongodb.net/P6_OC_Porter?retryWrites=true&w=majority', { //
            useNewUrlParser: true, // 
            useUnifiedTopology: true //
        })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => { //
    // Security fix - autorisation par url
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_FRONTEND);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;