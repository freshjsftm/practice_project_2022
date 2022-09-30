const createHttpError = require('http-errors');
const JwtService = require('../services/jwtService');


module.exports.checkAccessToken = async (req, res, next) => {
  try {
    const {headers:{authorization}} = req;
    if(authorization){
      const [, accessToken] = authorization.split(' ');  
      console.log("accessToken =========>>>>>>>>>>>>", accessToken)
      req.tokenData = await JwtService.verifyAccessToken(accessToken);
      return next();      
    }
    next(createHttpError(401, 'Need token'))
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