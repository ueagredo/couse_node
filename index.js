
const dovenv = require('dotenv').config()
const express = require('express')
const validator = require('./src/Utils/validation.js');
const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'users.json');
const logger = require('./src/middlewares/logger.js');
const errorHandle = require('./src/middlewares/errorHandle.js');
const authenticateToken = require('./src/middlewares/auth.js');


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(errorHandle);

const PORT = process.env.PORT || 3005

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


console.log('la aplicacion esta funcionando en el puerto', PORT);

app.get('/', (req,res) => {
    res.send(`
        <h1>Hola sPlatzi</h1>
        <p>Esta es usassadsna aplicacion de prueba</p>
        <p>COrre en el ${PORT}</p>
        `);
});

app.get('/users/:id', (req,res) => {
    const usedId = req.params.id;
    res.send(`El id del usuario es: ${usedId}`);
}
)

app.get('/search',(req, res) => {
    const termns = req.query.termino || 'no especificado';
    const category = req.query.categoria || 'Todas';

    res.send(`<h2>Buscando: ${termns}</h2>
              <h3>Categoria: ${category}</h3>
              <p>Resultados de la busqueda</p>`);
    })

app.get('/users', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        const users = JSON.parse(data);
        res.json(users);

    }); 
})

app.post('/users', (req, res) => {
    const newUser = req.body;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }
        if (validator.validateUser(newUser, JSON.parse(data)).isValid === false) {
            return res.status(400).json({ error: validator.validateUser(newUser, JSON.parse(data)).error });
        }

        const users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el usuario' });
            }
            res.status(201).json(newUser);
        });

    })

    
})

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id,10);
    const updatedUser = req.body;

    console.log('test ', validator.isValidUser(updatedUser));
    if (validator.isValidUser(updatedUser)) {
        return res.status(400).json({ error: validator.isValidUser(updatedUser).error });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexion de datos' });
        }
    
        let users = JSON.parse(data);
        users = users.map(user => 
            user.id === userId? {...user, ...updatedUser} : user
            );

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res
                .status(500)
                .json({ error: 'Error al actualizar el usuario' });
            }
            res.json({ message: 'Usuario actualizado correctamente', user: updatedUser });
            

})
    });
})

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el usuario' });
            }
            res.json({ message: 'Usuario eliminado correctamente' });
        });
    });
});

app.post('/forms', (req, res) => {

    const name = req.body.nombre || 'no especificado';
    const email = req.body.email || 'no especificado';

    res.json({
        message: 'Datos recibidos correctamente',
        data: {
            name,
            email
        }
    })
})

app.post('/api/data', (req, res) => {
const data = req.body || {};
console.log('Headers:', req.headers);
console.log('Datos recibidos:', req.body);
    if(!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    res.status(201).json({
        message: 'Datos recibidos correctamente',
        data: data
    })
})

app.get('/error', (req, res,next) => {
    next( new Error('Este es un error de prueba'));
});

app.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios desde la base de datos' });
    }
});

app.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', user: req.user });
});


app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER'
        }
    });
     res.status(201).json({
        message: 'Usuario registrado correctamente',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
})
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token});
})

app.listen(PORT, () => {
    console.log('servidor http://localhost:' + PORT);
});
