const express = require('express');
const blogRouter = express.Router();
const {Blog, User} = require('../models')
const {errorHandler, tokenExtractor} = require('../utils/middlewares')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')



blogRouter.get('/' , async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = 
      [{ title: {[Op.iLike]: `%${req.query.search}%`} }, { author: {[Op.iLike]: `%${req.query.search}%`} }]
    
  }

    const blogs = await Blog.findAll({
        order: [
          ['likes', 'DESC']
        ],
        attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['name']
            },
            where
    })
    res.json(blogs)
});



blogRouter.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)    
    const blog = await Blog.create({...req.body, userId: user.id})    
    res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})


blogRouter.delete('/:id', tokenExtractor ,async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (!user){
        return res.status(404).json({ error: 'Unauthorized!' });
    }
    if (blog.userId === user.id) {
        await Blog.destroy({where: {id: blog.id}})
        return res.status(204).end();
    }
    return res.status(404).json({ error: 'Unauthorized!' });
  } catch (error) {
        res.status(404).json({ error: 'Something went wrong :/' })
  }
});

blogRouter.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
        return res.status(404).json({ error: 'Record not found' });
    }
    blog.likes = req.body.likes;
    await blog.save();
    return res.status(200).json(blog);
    });

blogRouter.use(errorHandler)

module.exports = blogRouter