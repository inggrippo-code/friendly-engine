require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { connectDB, query } = require('./db.js');

const app = express();
app.use(cors());
app.use(express.json());

// --- MÁSCARA COMERCIAL: SERVICIOS FULL ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- RUTA PARA REGISTRAR USUARIOS ---
app.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', [nombre, email, hashedPassword]);
        res.status(201).send('Usuario registrado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario');
    }
});

// --- RUTAS DE CONSULTA ---
app.get('/usuarios', async (req, res) => {
    try {
        const result = await query('SELECT id, nombre, email, fecha_registro FROM usuarios ORDER BY id ASC;');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error al obtener usuarios');
    }
});

// --- INICIO DEL SERVIDOR ---
async function startServer() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
    }
}

startServer();

