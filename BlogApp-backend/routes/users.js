const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.status(200).json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      username,
      name,
      passwordHash
    })

    res.status(201).json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {username: req.params.username}
    })
    if(user) {
      user.name = req.body.name
      await user.save();
      return res.status(200).end()
    }
    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    
  }
})



module.exports = router