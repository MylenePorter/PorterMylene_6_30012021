const express = require('express');
const sauceRouter = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceController = require('../controllers/sauce');

sauceRouter.post('/', auth, multer, sauceController.addSauce);
sauceRouter.put('/:id', auth, multer, sauceController.modifySauce);
sauceRouter.get('/', auth, sauceController.getAllSauces);
sauceRouter.get('/:id', auth, sauceController.getOneSauce);
sauceRouter.delete('/:id', auth, sauceController.deleteSauce);
sauceRouter.post('/:id/like', auth, sauceController.likeSauceStatus);

module.exports = sauceRouter;