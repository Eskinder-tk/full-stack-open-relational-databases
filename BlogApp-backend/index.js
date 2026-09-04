const express = require('express')
const app = express()
const {errorHandler} = require('./utils/middlewares')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const blogRouter = require('./routes/blogs')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const authorRouter = require('./routes/authors')
const resetRouter = require('./routes/reset')

app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
console.log(process.env.TESTING);
if (process.env.TESTING === 'true') {
  console.log('REGISTERING RESET ROUTE')
  app.use('/api/reset', resetRouter)
}


app.get('/', (req, res) => {
  res.status(200).end();
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
app.use(errorHandler)