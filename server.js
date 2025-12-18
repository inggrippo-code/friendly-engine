const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Ruta para procesar el registro
app.post('/registro', (req, res) => {
    // Recibimos los nuevos datos desde el formulario
    const { tipo, nombre, email, celular, ciudad, servicio } = req.body;
    
    // Formateamos la línea que se guardará en el archivo
    const nuevaLinea = `Tipo: ${tipo} | Nombre: ${nombre} | Email: ${email} | Celular: ${celular} | Ciudad: ${ciudad} | Servicio: ${servicio}\n`;

    // Guardamos en el archivo "usuarios.txt"
    fs.appendFile('usuarios.txt', nuevaLinea, (err) => {
        if (err) {
            return res.status(500).send("Error al guardar los datos");
        }
        res.send("¡Usuario registrado con éxito!");
    });
});

// Ruta secreta para que TÚ veas la lista de registrados
app.get('/usuarios', (req, res) => {
    fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err) return res.send("No hay usuarios registrados aún.");
        res.send(`<pre>${data}</pre>`);
    });
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
 
