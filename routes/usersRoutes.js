const express = require('express')
const UserController = require('../controllers/UserController')
const checkAuth = require('../helpers/auth').checkAuth

const router = express.Router()

router.get('/:id', checkAuth, UserController.userToughts)

module.exports = router