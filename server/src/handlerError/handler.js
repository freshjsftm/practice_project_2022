const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

module.exports = (err, req, res, next) => {
  console.log('LOG ERROR ==========>>>>>',err);
  if(err instanceof TokenExpiredError){
    return res.status(419).send('Token Expired');
  }
  if(err instanceof JsonWebTokenError){
    return res.status(401).send('Invalid Token');
  }
  if (err.message && err.status) {
    return res.status(err.status).send(err.message);
  } 
  res.status(500).send('Server Error');
};
