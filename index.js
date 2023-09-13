const winston = require('winston')
const express= require('express');
const dotenv = require('dotenv').config();
const app = express(); 
const morgan = require('morgan');
const helmet = require('helmet'); 
const session = require('express-session');

app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    })
  );

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/dbConnection')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port,()=> winston.info(`listening on port ${port}....`))  

module.exports = server;