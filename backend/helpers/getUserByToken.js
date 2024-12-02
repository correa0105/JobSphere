import jwt from 'jsonwebtoken';
import User from '../models/User';

const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: 'You are not authenticated.' });
  }

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  const userId = decoded.id;

  const user = await User.findByPk(userId);

  return user;
};

export default getUserByToken;
