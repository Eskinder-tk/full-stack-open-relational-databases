const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../utils/config')
const User = require('../models/User')

router.post('/', async (req, res) => {
  console.log('LOGIN ROUTE HIT')
  const { username, password } = req.body
  console.log(username, password)

  const user = await User.findOne({
    where: { username }
  })

  if (!user) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const passwordCorrect = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router