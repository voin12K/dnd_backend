const { body } = require('express-validator');

exports.registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('fullName').isLength({ min: 3 }), 
    body('avatarUrl').optional().isURL(),
];
