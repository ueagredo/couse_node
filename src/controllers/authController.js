const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {   
    try {
        const { name, email, password, role } = req.body;
        await registerUser(name, email, password, role);
        res.status(201).json({
            message: 'User registered successfully',
        });
    }
    catch (error) {

        res.status(500).json({ error: error.message });

}
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

module.exports = {
    register,
    login
};