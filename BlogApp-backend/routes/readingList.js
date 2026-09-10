const express = require('express');
const router = express.Router();
const {Blog, User, ReadingList} = require('../models')
const {tokenExtractor} = require('../utils/middlewares')

router.post('/', async (req, res) => {
    const { blogId, userId } = req.body

    if (!blogId || !userId) {
        return res.status(400).json({ error: 'blogId and userId are required' })
    }

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
        return res.status(404).json({ error: "Blog doesn't exist!" })
    }

    const user = await User.findByPk(userId)
    if (!user) {
        return res.status(404).json({ error: "User doesn't exist!" })
    }

    const existingReading = await ReadingList.findOne({ where: { blogId, userId } })
    if (existingReading) {
        return res.status(400).json({ error: 'Blog is already in the reading list' })
    }

    const readingBlog = await ReadingList.create({ blogId, userId })
    return res.status(201).json(readingBlog)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const reading = await ReadingList.findByPk(req.params.id)
    if (!reading) {
        return res.status(404).json({ error: 'Reading list entry not found' })
    }

    if (reading.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'Unauthorized.' })
    }

    reading.read = req.body.read
    await reading.save()
    return res.status(200).json(reading)
})

module.exports = router