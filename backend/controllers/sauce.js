const fs = require('fs');
const sauceModel = require('../models/sauce');

exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new sauceModel({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a été créée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    sauceModel.updateOne({ _id: req.params.id }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({ message: 'La sauce a été modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    sauceModel.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauceModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce a été supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(501).json({ error }));
};

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