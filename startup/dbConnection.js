const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
const db = config.get('db');
const connectDb = async () => {
  try {
    // const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    const connect = await mongoose.connect(db);
    winston.info(
       `database connected to ${db}`
      // "Database connected: ",
      // connect.connection.host,
      // connect.connection.name
    );
  } catch (err) {
    winston.info(err);
    process.exit(1);
  } 
};

module.exports = connectDb;
 