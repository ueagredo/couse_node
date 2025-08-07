const {Router} = require('express');
const { login, register } = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');

const router = Router();

router.post('/login', login);
router.post('/register', register);

router.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

module.exports = router;