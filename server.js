const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Ruta para procesar el registro con los nuevos campos de calificación
app.post('/registro', (req, res) => {
    const { tipo, nombre, email, celular, ciudad, servicio, resena, experiencia, referencias } = req.body;
    
    // Creamos el objeto con TODO lo que el prestador nos envió
    const nuevoUsuario = { 
        tipo, 
        nombre, 
        email, 
        celular, 
        ciudad, 
        servicio, 
        resena: resena || "Sin reseña", 
        experiencia: experiencia || "Sin datos", 
        referencias: referencias || "Sin referencias"
    };
    
    const linea = JSON.stringify(nuevoUsuario) + "\n";

    fs.appendFile('usuarios.txt', linea, (err) => {
        if (err) return res.status(500).send("Error al guardar");
        res.send("¡Usuario registrado con éxito!");
    });
});

// Ruta para que el buscador obtenga los datos actualizados
app.get('/usuarios-datos', (req, res) => {
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err || !data) return res.json([]);
        try {
            const lista = data.trim().split("\n").map(linea => JSON.parse(linea));
            res.json(lista);
        } catch (e) {
            res.json([]); // Evita que el servidor se caiga si hay un error en el archivo
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor SERVICIOS FULL activo"));
