const { body } = require('express-validator');

exports.registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'The password must contain at least 8 characters').isLength({ min: 8 }),
    body('fullName', 'Minimum name length 3 characters').isLength({ min: 3 }), 
    body('avatarUrl', 'Invalid link format').optional().isURL(),
];
