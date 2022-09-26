const authRouter = require('express').Router();
const AuthController = require('../controllers/authController');

//login
authRouter.post('/sign-in', AuthController.signIn);
//registration
authRouter.post('/sign-up', AuthController.signUp);
//refresh
authRouter.post('/refresh', AuthController.refresh);

module.exports = authRouter;