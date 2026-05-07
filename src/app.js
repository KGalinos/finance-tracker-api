const express = require('express');
const path = require('path');
const router = require('./routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', router);

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

app.listen(PORT, () => {
    console.log(`Finance Tracker API running on http://localhost:${PORT}`);
});
