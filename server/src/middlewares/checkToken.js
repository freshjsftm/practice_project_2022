const createHttpError = require('http-errors')
const JwtService = require('../services/jwtService')
const TokenError = require('../errors/TokenError')
const userQueries = require('../controllers/queries/userQueries')

module.exports.checkAuth = async (req, res, next) => {
  try {
    const {
      headers: { authorization }
    } = req
    if (authorization) {
      const [, accessToken] = authorization.split(' ')
      const tokenData = await JwtService.verifyAccessToken(accessToken)
      const foundUser = await userQueries.findUser({ id: tokenData.userId })
      delete foundUser.password
      return res.send(foundUser)
    }
    next(createHttpError(401, 'Need token'))
  } catch (err) {
    next(err)
  }
}
