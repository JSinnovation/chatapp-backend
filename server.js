const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// const logger = require('morgan');

const app = express();

const dbConfig = require('./config/secret');
const auth = require('./routes/authRoutes');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
// app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true }
);


//app.use('/api/chatapp', auth);

app.use('/api/chatapp', auth);

app.listen(3002,() => {
    console.log('Running on port 3002'); 
});   