const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Esta línea es la clave: le dice al servidor que busque archivos en la carpeta principal
app.use(express.static(path.join(__dirname, '.')));

// Ruta para el registro de usuarios
app.post('/registro', (req, res) => {
    const { tipo, nombre, email, celular, ciudad, servicio } = req.body;
    const nuevoUsuario = { tipo, nombre, email, celular, ciudad, servicio };
    const linea = JSON.stringify(nuevoUsuario) + "\n";

    fs.appendFile('usuarios.txt', linea, (err) => {
        if (err) return res.status(500).send("Error al guardar");
        res.send("¡Usuario registrado con éxito!");
    });
});

// Ruta para obtener los datos que usará el buscador
app.get('/usuarios-datos', (req, res) => {
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err || !data) return res.json([]);
        const lista = data.trim().split("\n").map(linea => JSON.parse(linea));
        res.json(lista);
    });
});

// Ruta secreta para ver la lista cruda
app.get('/lista', (req, res) => {
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err) return res.send("No hay datos");
        res.send(`<pre>${data}</pre>`);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor activo"));
 
