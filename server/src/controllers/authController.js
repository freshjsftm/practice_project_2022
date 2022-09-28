const { promisify } = require('util')
const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const { User, RefreshToken } = require('../models')
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TIME,
  MAX_DEVICE_AMOUNT
} = require('../constants')

const signPromiseJWT = promisify(jwt.sign)

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { email, password }
    } = req
    //find user by email
    const user = await User.findOne({
      where: { email }
    })
    //compare password
    if (user && (await user.comparePassword(password))) {
      //create tokenPair
      const accessToken = await signPromiseJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_TIME
        }
      )
      const refreshToken = await signPromiseJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: REFRESH_TOKEN_TIME
        }
      )
      if ((await user.countRefreshTokens()) >= MAX_DEVICE_AMOUNT) {
        const [oldestToken] = await user.getRefreshTokens({
          order: [['updatedAt', 'ASC']]
        })
        await oldestToken.update({ value: refreshToken })
      } else {
        await user.createRefreshToken({ value: refreshToken })
      }

      //send user with tokenPair
      return res.status(200).send({
        data: {
          user,
          tokenPair: {
            access: accessToken,
            refresh: refreshToken
          }
        }
      })
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
      //create tokenPair
      const accessToken = await signPromiseJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_TIME
        }
      )
      const refreshToken = await signPromiseJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: REFRESH_TOKEN_TIME
        }
      )
      await user.createRefreshToken({ value: refreshToken })

      //send user with tokenPair
      return res.status(200).send({
        data: {
          user,
          tokenPair: {
            access: accessToken,
            refresh: refreshToken
          }
        }
      })
    }
    next(createHttpError(400, 'Invalid user data.'))
  } catch (error) {
    next(error)
  }
}
module.exports.refresh = async (req, res, next) => {
  try {
    const {body : {refreshToken} } = req; //refreshToken is not expired
    const refreshTokenInstance = await RefreshToken.findOne({
      where: {
        value :refreshToken
      }
    })
    if(!refreshTokenInstance){
      next(createHttpError(404, 'User token not found.'))
    }
    const user = await refreshTokenInstance.getUser();
    if (user) {
      //create tokenPair
      const accessToken = await signPromiseJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_TIME
        }
      )
      const refreshTokenNew = await signPromiseJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: REFRESH_TOKEN_TIME
        }
      )
      await refreshTokenInstance.update({value: refreshTokenNew})

      //send user with tokenPair
      return res.status(200).send({
        data: {
          user,
          tokenPair: {
            access: accessToken,
            refresh: refreshTokenNew
          }
        }
      })
    }
    next(createHttpError(404, 'User not found.'))
  } catch (error) {
    next(error)
  }
}
