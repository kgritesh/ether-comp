import jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'express-jwt';

import User from '../user/models';
import config from '../config/config';

export function encodeUser(user) {
  return jwt.sign({
    sub: user.id
  }, config.SECRET_KEY, config.JWT);
}

export function decodeUser(payload) {
  const userId = payload.sub;
  return User.get(userId);
}


export async function loadUser(req, res, next) {

  if (req.user) {
    req.user = await decodeUser(req.user);
    if (!req.user) {
      return next(
        new UnauthorizedError('user_not_found', new Error('User not found')));
    }
  }
  return next();
}
