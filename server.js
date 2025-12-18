const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// RUTA PARA REGISTRAR PRESTADORES (Ahora nacen sin verificación)
app.post('/registro', (req, res) => {
    const { tipo, nombre, email, celular, ciudad, servicio, resena } = req.body;
    
    const nuevoUsuario = { 
        tipo, 
        nombre, 
        email, 
        celular, 
        ciudad, 
        servicio, 
        resena: resena || "Sin reseña", 
        calificacion: "Buena",
        verificado: false // Obliga a validación manual por el administrador
    };

    const linea = JSON.stringify(nuevoUsuario) + "\n";
    
    fs.appendFile('usuarios.txt', linea, (err) => {
        if (err) return res.status(500).send("Error al guardar.");
        res.send("Registro recibido. Pendiente de verificación.");
    });
});

// RUTA PARA CALIFICAR (Guarda los votos permanentemente)
app.post('/calificar', (req, res) => {
    const { email, nuevaCalif } = req.body;
    
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error al leer base de datos.");
        
        let lineas = data.trim().split('\n');
        let actualizado = false;

        const nuevasLineas = lineas.map(linea => {
            let u = JSON.parse(linea);
            if (u.email === email) {
                u.calificacion = nuevaCalif;
                actualizado = true;
            }
            return JSON.stringify(u);
        });

        fs.writeFile('usuarios.txt', nuevasLineas.join('\n') + '\n', (err) => {
            if (err) return res.status(500).send("Error al guardar voto.");
            res.send("Voto guardado.");
        });
    });
});

// RUTA PARA LEER LOS DATOS (El buscador usa esta ruta)
app.get('/usuarios-datos', (req, res) => {
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err) return res.json([]);
        const lineas = data.trim().split('\n').map(l => JSON.parse(l));
        res.json(lineas);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
