const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req,res) => {
    res.send(`
        <h1>Hola sPlatzi</h1>
        <p>Esta es usassadsna aplicacion de prueba</p>
        <p>COrre en el ${PORT}</p>
        `);
});

app.listen(PORT, () => {
    console.log('la aplicacion esta funcionando');
});