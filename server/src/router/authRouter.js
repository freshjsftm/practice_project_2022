const authRouter = require('express').Router();
const AuthController = require('../controllers/authController');
const validators = require('../middlewares/validators');
const { checkRefreshToken } = require('../middlewares/tokenMw');

authRouter.post('/sign-in', 
  validators.validateLogin, 
  AuthController.signIn
);
authRouter.post('/sign-up', 
  validators.validateRegistrationData,
  AuthController.signUp
);
authRouter.post('/refresh', 
  checkRefreshToken, 
  AuthController.refresh
);

module.exports = authRouter;