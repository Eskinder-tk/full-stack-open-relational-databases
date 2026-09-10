const {SECRET} = require('../utils/config')
const jwt = require('jsonwebtoken')
const Session = require('../models/Session')
const User = require('../models/User')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors[0].message });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.errors[0].message });
  }
  console.error(error)

  return response.status(500).json({
    error: 'internal server error'
  })
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const session = await Session.findOne({ where: { session: authorization.substring(7) } })

      if (!session) {
        return res.status(401).json({ error: 'Unauthorized.' })
      }

      const user = await User.findByPk(session.userId)
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' })
      }

      if (user.disabled === true) {
        return res.status(401).json({ error: 'Account blocked.' })
      }

      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      return next()
    } catch (error) {
      console.log('JWT Error:', error.message)
      return res.status(401).json({ error: 'token invalid' })
    }
  }

  return res.status(401).json({ error: 'token missing' })
}

module.exports = {errorHandler, tokenExtractor}