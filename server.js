require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const bodyParser = require('body-parser');
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) =>  console.log(error));
db.once('open', () => console.log('connected to database'));

// app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

const bulletinRouter = require('./routes/bulletins');
app.use('/bulletins', bulletinRouter);

app.listen(PORT, function() {
    console.log('Server is running on PORT:', PORT);
})