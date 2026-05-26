const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurar Express
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Para permitir recibir el HTML completo modificado
app.use(express.text({ type: 'text/html', limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del directorio actual
app.use(express.static(path.join(__dirname)));

// Configurar Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        // Renombrar archivo para evitar espacios y caracteres raros
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// API: Subir archivo (foto, video, documento)
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    // Devolvemos la ruta relativa para usarla en el HTML
    const filePath = `uploads/${req.file.filename}`;
    res.json({ success: true, filePath: filePath });
});

// API: Guardar el nuevo HTML
app.post('/save', (req, res) => {
    const htmlContent = req.body;
    if (!htmlContent) {
        return res.status(400).json({ success: false, message: 'No se envió contenido HTML.' });
    }

    const indexPath = path.join(__dirname, 'index.html');

    // Sobrescribir el archivo index.html
    fs.writeFile(indexPath, htmlContent, 'utf8', (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.status(500).json({ success: false, message: 'Error al guardar el archivo' });
        }
        console.log('index.html actualizado correctamente.');
        res.json({ success: true, message: 'Página actualizada correctamente' });
    });
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 SERVIDOR LOCAL INICIADO`);
    console.log(`👉 Abre en tu navegador: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
