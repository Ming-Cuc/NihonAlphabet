const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());           // Cho phép gọi từ frontend khác cổng

app.get('/api/decode', (req, res) => {
    res.json({ ok: true, message: 'API is working' });
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});