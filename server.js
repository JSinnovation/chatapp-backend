const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// const logger = require('morgan');

const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const dbConfig = require('./config/secret');

require('./socket/streams')(io);

const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');


app.use((req, res, next)  => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT','OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true }
); 


app.use('/api/chatapp', auth);
app.use('/api/chatapp', posts);

server.listen(3002,() => {
    console.log('Listening on port 3002'); 
});    