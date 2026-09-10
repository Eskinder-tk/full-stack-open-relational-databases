const router = require('express').Router()
const {tokenExtractor} = require('../utils/middlewares')
const Session = require('../models/Session')

router.delete('/',tokenExtractor , async (req, res) => {
    
    await Session.destroy({
        where: {
            userId: req.decodedToken.id
        }
    })
    res.status(204).end()
})

module.exports = router