const createHttpError = require('http-errors');
const {User} = require('../models');
//login
module.exports.signIn = async (req,res,next) => {
  try {
    const {body:{email, password}} = req;
    //find user by email
    const user = await User.findOne({
      where: {email}
    });
    //compare password
    if(user && (await user.comparePassword(password))){
      //create tokenPair
      //send user with tokenPair
    }
    next(createHttpError(401,'Invalid user authentication.'))
  } catch (error) {
    next(error)
  }
}
module.exports.signUp = async (req,res,next) => {
  try {
    
  } catch (error) {
    next(error)
  }
}
module.exports.refresh = async (req,res,next) => {
  try {
    
  } catch (error) {
    next(error)
  }
}