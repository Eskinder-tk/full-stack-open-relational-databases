const express = require('express');
const router = express.Router();
const {sequelize} = require('../utils/db')

router.post('/', async (req, res) => {
    console.log('RESET ROUTE HIT')
    await sequelize.sync({ force: true });
    res.status(204).end()
})

module.exports = router