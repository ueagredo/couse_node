const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (name, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER'
        }
    });
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };
}


const loginUser = async (email, password) => { 
    const user = await prisma.user.findUnique({where : { email}})

    if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Usuario o contraseña incorrectos');
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token
}

module.exports = {
    registerUser,
    loginUser
};
