const express = require('express');
const session = require('express-session');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);
router.get('/signin', userController.userLogin);
router.get('/singup', userController.userRegister);
router.post('/logout', userController.logout);
router.get('/profile',userController.checkAuth, (req, res) => {
    res.json(req.session.user);
});

module.exports = router

