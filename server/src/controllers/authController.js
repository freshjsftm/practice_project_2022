const createHttpError = require('http-errors')
const { User, RefreshToken } = require('../models')
const AuthService = require('../services/authService')

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { email, password }
    } = req
    const user = await User.findOne({
      where: { email }
    })
    if (user && (await user.comparePassword(password))) {
      const data = await AuthService.createSeession(user)
      return res.status(200).send({ data })
    }
    next(createHttpError(401, 'Invalid user authentication.'))
  } catch (error) {
    next(error)
  }
}
module.exports.signUp = async (req, res, next) => {
  try {
    const { body } = req
    const user = await User.create(body)
    if (user) {
      const data = await AuthService.createSeession(user)
      return res.status(200).send({ data })
    }
    next(createHttpError(400, 'Invalid user data.'))
  } catch (error) {
    next(error)
  }
}
module.exports.refresh = async (req, res, next) => {
  try {
    const {
      body: { refreshToken } //refreshToken is not expired
    } = req 
    const refreshTokenInstance = await RefreshToken.findOne({
      where: {
        value: refreshToken
      }
    })
    if (!refreshTokenInstance) {
      next(createHttpError(404, 'User token not found.'))
    }
    const data = await AuthService.refreshSeession(refreshTokenInstance)
    res.status(200).send({ data })
  } catch (error) {
    next(error)
  }
}
