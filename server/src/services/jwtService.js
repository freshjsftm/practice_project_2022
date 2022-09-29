const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TIME
} = require('../constants')

const tokenConfig = {
  access:{
    secret: ACCESS_TOKEN_SECRET,
    time: ACCESS_TOKEN_TIME
  },
  refresh:{
    secret: REFRESH_TOKEN_SECRET,
    time: REFRESH_TOKEN_TIME
  }
}

const verifyPromiseJWT = promisify(jwt.verify);
const signPromiseJWT = promisify(jwt.sign);

const verifyToken = (token, {secret})=> verifyPromiseJWT(token, secret);
const createToken = (payload, {secret, time}) => {
  return signPromiseJWT(
    {
      userId: payload.id,
      email: payload.email,
      role: payload.role
    },
    secret,
    {
      expiresIn: time
    }
  )
}

module.exports.createTokenPair = async (payload) => {
  return {
    access: await createToken(payload, tokenConfig.access), 
    refresh: await createToken(payload, tokenConfig.refresh)
  }
}

module.exports.verifyAccessToken = (token) => verifyToken(token, tokenConfig.access );
module.exports.verifyRefreshToken = (token) => verifyToken(token, tokenConfig.refresh );