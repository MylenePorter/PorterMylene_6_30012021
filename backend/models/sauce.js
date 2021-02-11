// Dependencies
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { // identifiant unique crée par Mongo DB
        type: String,
        required: true
    },
    name: { // identifiant unique MongoDB pour l'utilisateur qui a crée la sauce
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    usersLiked: { // tableau  d'identifiants d'utilisateurs ayant aimé la sauce
        type: [String]
    },
    usersDisliked: { // tableau  d'identifiants d'utilisateurs n'ayant pas aimé la sauce
        type: [String]
    }
});

module.exports = mongoose.model('sauce', sauceSchema);