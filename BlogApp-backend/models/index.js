const {sequelize} = require('../utils/db') 
const Blog = require('./Blog')
const User = require('./User')

User.hasMany(Blog)
Blog.belongsTo(User)

// Automatically calculates table dependency order
sequelize.sync({ alter: true })

module.exports = {
  Blog,
  User
}