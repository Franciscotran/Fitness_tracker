// create the express server here
require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const cors = require('cors')

const  client  = require('./db/client');
client.connect();
server.use(cors())
server.use(express.json()) 
const morgan = require('morgan');
server.use(morgan('dev'));

const apiRouter = require('./api');
server.use('/api', apiRouter);


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});







