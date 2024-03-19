const express = require('express');
const app = express();
const cors = require('cors');
const dbConnect = require('./middleware/dbConnect');

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

dbConnect();

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})