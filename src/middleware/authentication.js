const jwt = require('jsonwebtoken')

exports.authenticateToken= (req, res, next)=>{
    const authHeader = req.headers['authorization']
   /*  console.log(authHeader) */
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send([{
        "message": "Veuillez regénérer un autre token"
    }])
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.status(403).send([{
        "message": "Impossible de se connecter"
      }])
      req.user = user
      next()
    })
}

exports.generateAccessToken = (user)=>{
    return jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1y'})
}

exports.generateRefreshToken = (user)=>{
    return jwt.sign( user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'})
}