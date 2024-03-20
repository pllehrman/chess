const express = require('express');
const app = express();
const cors = require('cors');

//Routes
const games = require('./routes/games');
const users = require('./routes/users');



//Middleware 
const dbConnect = require('./middleware/dbConnect');
const errorHandler = require('./middleware/errorHandler');
app.use(express.json()) //middleware to parse JSON bodies
app.use(cors());

dbConnect();

// Serving routes
app.use('/games', games);
app.use('/users', users);   

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})