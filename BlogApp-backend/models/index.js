const Blog = require('./Blog')
const User = require('./User')
const ReadingList = require('./ReadingList')
const Session = require('./Session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasMany(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, {through: ReadingList, as: 'readings'})
Blog.belongsToMany(User, {through: ReadingList, as: 'user_readings'})


module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}