import OAuthRefreshToken from '../models/OauthRefreshToken.js'; // Adjust the import path according to your setup

const findByUserId = async (userId) => {
  return OAuthRefreshToken.findOne({ where: { userId } });
};

const save = async (userId, refreshToken, expiresAt) => {
  const existingToken = await findByUserId(userId);
  if (existingToken) {
    return existingToken.update({ refreshToken, expiresAt });
  } else {
    return OAuthRefreshToken.create({ userId, refreshToken, expiresAt });
  }
};

export default { findByUserId, save };
