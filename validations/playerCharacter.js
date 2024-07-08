const { body, checkSchema } = require('express-validator');

const numericRange = (min, max) => ({
  isInt: { errorMessage: `Value must be an integer between ${min} and ${max}`, options: { min, max } },
  toInt: true
});

const characterValidation = [
  body('name')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('lvl')
    .isInt({ min: 1, max: 20 }).withMessage('Level must be between 1 and 20')
    .toInt(),
  body('exp')
    .isInt({ min: 0 }).withMessage('Experience cannot be less than 0')
    .toInt(),
  body('account')
    .isMongoId().withMessage('Account ID must be a valid Mongo ID'),
  body('race')
    .isString().withMessage('Race must be a string')
    .isLength({ min: 1 }).withMessage('Race cannot be empty'),
  body('class')
    .isString().withMessage('Class must be a string')
    .isLength({ min: 1 }).withMessage('Class cannot be empty'),
  body('age')
    .isInt({ min: 0 }).withMessage('Age cannot be less than 0')
    .toInt(),
  body('hp')
    .isInt({ min: 1 }).withMessage('Hit Points cannot be less than 1')
    .toInt(),
  body('hit_dice')
    .isString().withMessage('Hit Dice must be a string')
    .isLength({ min: 1 }).withMessage('Hit Dice cannot be empty'),
  body('max_hp')
    .isInt({ min: 1 }).withMessage('Max Hit Points cannot be less than 1')
    .toInt(),
  body('ac')
    .isInt({ min: 0 }).withMessage('Armor Class cannot be less than 0')
    .toInt(),
  body('initiative')
    .isInt({ min: 0 }).withMessage('Initiative cannot be less than 0')
    .toInt(),
  body('speed')
    .isInt({ min: 0 }).withMessage('Speed cannot be less than 0')
    .toInt(),
  body('proficiency')
    .isInt({ min: 0, max: 6 }).withMessage('Proficiency bonus must be between 0 and 6')
    .toInt(),
  body('playerName')
    .isString().withMessage('Player Name must be a string')
    .isLength({ min: 1 }).withMessage('Player Name cannot be empty'),
  checkSchema({
    'mainStats.strength': numericRange(1, 30),
    'mainStats.dexterity': numericRange(1, 30),
    'mainStats.constitution': numericRange(1, 30),
    'mainStats.intelligence': numericRange(1, 30),
    'mainStats.wisdom': numericRange(1, 30),
    'mainStats.charisma': numericRange(1, 30),
    'bonusStats.bonusStrength': numericRange(0, 10),
    'bonusStats.bonusDexterity': numericRange(0, 10),
    'bonusStats.bonusConstitution': numericRange(0, 10),
    'bonusStats.bonusIntelligence': numericRange(0, 10),
    'bonusStats.bonusWisdom': numericRange(0, 10),
    'bonusStats.bonusCharisma': numericRange(0, 10)
  })
];

module.exports = { characterValidation };
