const fs = require('fs'); // Donne accès aux fonctions du système de fichiers
const sauceModel = require('../models/sauce'); // Accès modèle 'sauce'

// Crée nouvelle sauce
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new sauceModel({
        ...sauceObject, // ... = spread : préserve l'intégrité hiérarchique
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Chemin d'accès pour l'image
    });
    sauce.save() // Enregistrement sauce
        .then(() => res.status(201).json({ message: 'La sauce a été créée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Modifier sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // s'il y a un fichier (image)
        ...JSON.parse(req.body.sauce), // récupère les informations du formulaire
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // communique l'url de l'image
    } : {...req.body }; // s'il n'y a pas de fichier (image), récupère les infos du formulaire
    sauceModel.updateOne({ _id: req.params.id }, { // met à jour les informations de la sauce
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({ message: 'La sauce a été modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Trouver une sauce
exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id }) // Va chercher une sauce grâce à son id
        .then(sauce => res.status(200).json(sauce)) // Affiche la sauce trouvée
        .catch(error => res.status(404).json({ error })); // Sinon affiche une erreur
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    sauceModel.find() // Va chercher toutes les sauces contenue dans la DB
        .then(sauces => res.status(200).json(sauces)) // Affiche la liste
        .catch(error => res.status(400).json({ error })); // Sinon affiche une erreur
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id }) // Va chercher une sauce grâce à son id
        .then(sauce => { // quand trouve la sauce
            const filename = sauce.imageUrl.split('/images/')[1]; // Va trouver l'image
            fs.unlink(`images/${filename}`, () => { // Supprime l'image de la sauce et si succès continue 
                sauceModel.deleteOne({ _id: req.params.id }) // Supprime la sauce de la DB
                    .then(() => res.status(200).json({ message: 'La sauce a été supprimée !' })) // Message confirmation
                    .catch(error => res.status(400).json({ error })); // Sinon affiche erreur
            });
        })
        .catch(error => res.status(501).json({ error }));
};

// Ajouter/enlever sauce des favoris
exports.likeSauceStatus = (req, res, next) => {
    const userID = req.body.userId;
    const like = req.body.like;

    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (like) {
                case 1:
                    console.log('Yes!! La sauce a du succès!');
                    sauceModel.updateOne({ _id: req.params.id }, {
                            $inc: { likes: +1 },
                            $push: { usersLiked: userID }
                        })
                        .then(() => res.status(200).json({ message: '1' }))
                        .catch(error => res.status(400).json({ error }));
                    break;

                case -1:
                    console.log('Aïe!! Pas terrible la sauce!');
                    sauceModel.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: +1 },
                            $push: { usersDisliked: userID }
                        })
                        .then(() => res.status(200).json({ message: '1' }))
                        .catch(error => res.status(400).json({ error }));
                    break;

                case 0:
                    if (sauce.usersDisliked.includes(userID)) {
                        sauceModel.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: userID }
                            })
                            .then(() => res.status(200).json({ message: 'Le dislike est supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        sauceModel.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: userID }
                            })
                            .then(() => res.status(200).json({ message: 'Le like est supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
            }
        })
        .catch(error => res.status(404).json({ error }));
}