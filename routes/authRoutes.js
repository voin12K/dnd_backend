import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidation } from '../validations/auth.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', login);

export default router;
