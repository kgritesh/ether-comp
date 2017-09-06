import { serializeUser } from './serializers';

export default {

  async updateUser(req, res, next) {
    try {
      const body = req.body;
      await req.user.update(body);
      const userJson = await serializeUser(req.user);
      res.json(userJson);
    } catch (error) {
      next(error);
    }
  }
};
