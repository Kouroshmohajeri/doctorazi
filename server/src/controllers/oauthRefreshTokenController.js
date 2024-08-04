import oauthRefreshTokenRepository from '../repository/oauthRefreshTokenRepository.js';

const saveRefreshToken = async (req, res) => {
  try {
    const { userId, refreshToken, expiresAt } = req.body;
    const token = await oauthRefreshTokenRepository.save(userId, refreshToken, expiresAt);
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { saveRefreshToken };
