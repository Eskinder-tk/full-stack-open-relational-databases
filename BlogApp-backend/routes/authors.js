const express = require('express');
const router = express.Router();
const {Blog} = require('../models')
const {sequelize} = require('../utils/db')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({ 
        group: 'author',
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        order: [
            [sequelize.fn('SUM', sequelize.col('likes')), 'DESC']
        ]
     });
     res.json(authors)
})

module.exports = router