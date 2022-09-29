const JwtService = require('../services/jwtService');

module.exports.checkAccessToken = async (req, res, next) => {
  try {
    const {headers:{authorization}} = req;
    const [, accessToken] = authorization.split(' ');  
    req.tokenData = await JwtService.verifyAccessToken(accessToken);
    next();
  } catch (error) {
    next(error)
  }
}

module.exports.checkRefreshToken = async (req, res, next) => {
  try {
    const {body: {refreshToken}} = req;
    req.tokenData = await JwtService.verifyRefreshToken(refreshToken);
    next();
  } catch (error) {
    next(error)
  }
}