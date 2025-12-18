const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Servir la página de búsqueda cuando se pida
app.get('/buscar', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscar.html'));
});

// Ruta para procesar el registro
app.post('/registro', (req, res) => {
    const { tipo, nombre, email, celular, ciudad, servicio } = req.body;
    
    // Guardamos los datos como un objeto para que sea fácil buscarlos luego
    const nuevoUsuario = { tipo, nombre, email, celular, ciudad, servicio };
    const linea = JSON.stringify(nuevoUsuario) + "\n";

    fs.appendFile('usuarios.txt', linea, (err) => {
        if (err) return res.status(500).send("Error al guardar");
        res.send("¡Usuario registrado con éxito!");
    });
});

// Ruta que el buscador usa para obtener los datos
app.get('/usuarios-datos', (req, res) => {
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err || !data) return res.json([]);
        // Convertimos el texto del archivo en una lista real para el buscador
        const lista = data.trim().split("\n").map(linea => JSON.parse(linea));
        res.json(lista);
    });
});

app.listen(3000, () => console.log("Servidor listo"));
