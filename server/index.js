const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
import { ok } from 'assert';
import { error, time } from 'console';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//Load kana data at startup
const dataPath = path.join(__dirname, 'data', 'kana.json');
const raw = fs.readFileSync(dataPath);
const Kana = JSON.parse(raw);

app.get('/api/health', (req, res) => {
    res.json({ok: true, time: new Date().toISOString()});
});

app.get('/api/kana', (req, res) => {
    const type = req.query.type; // hiragana or katakana
    if (!['hira', 'kata'].includes(type)) {
        return res.status(400).json(error('Invalid type parameter') );
    }
    res.set('Cache-Control','no-store');
    return res.json(Kana[type]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});