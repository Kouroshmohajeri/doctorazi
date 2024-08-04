import express from 'express';
import oauthRefreshTokenController from '../controllers/oauthRefreshTokenController.js'; 

const router = express.Router();

router.post('/refreshTokens/save', oauthRefreshTokenController.saveRefreshToken);

export default router;
