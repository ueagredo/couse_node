const express = require('express');
const routes = require('./routes');
const app = express();

const logger = require('./middlewares/logger');
const errorHandle = require('./middlewares/errorHandle');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(errorHandle);


app.use('/api', routes);
app.use('/admin', routes);

app.get('/', (req, res) => {
    res.send(`
        <h1>Hola World/h1>
        <p>Esta es una aplicacion de prueba</p>
        <p>COrre en el puerto ${process.env.PORT}</p>
    `);
});

module.exports = app;