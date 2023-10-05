

const userController = require('../controller/userController.js')

const router = require('express').Router()


router.get('/healthz', userController.check)

 

module.exports = router