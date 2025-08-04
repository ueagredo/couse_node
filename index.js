
const dovenv = require('dotenv').config()
const express = require('express')



const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3005


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

app.listen(PORT, () => {
    console.log('servidor http://localhost:' + PORT);
});