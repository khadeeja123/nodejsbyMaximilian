const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();

const User = require('../models/user');

const isAuth =  require('../middleware/is-auth');

const authController = require('../controllers/auth');


router.put('/signup',[
    body('email').isEmail().withMessage('Please Enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value}).then(userDoc => {
            if ( userDoc) {
                return Promise.reject('Email address already exists!');
            }
        });
    })
    .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
], authController.signup);

router.post('/login', authController.login);

router.get('/status',isAuth, authController.getUserStatus);

router.patch('/status', [
    body('status').trim().not().isEmpty()
], isAuth, authController.updateUserStatus );


module.exports = router;