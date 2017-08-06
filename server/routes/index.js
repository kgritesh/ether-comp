import express from 'express';


export default () => {
  const router = express.Router();
  router.get('/', function(req, res, next) {
    res.json({
      message: 'Welcome To Express'
    });
  });
  return router;
}
