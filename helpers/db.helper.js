const { Sequelize } = require('sequelize');
const {
  DB_DATA_URI,
  DB_DEVICES_URI,
  SQ_LOGGING
} = process.env;

const logging = SQ_LOGGING == 1 ? console.log : false;

const dataDB = new Sequelize(DB_DATA_URI, { logging });
const devicesDB = new Sequelize(DB_DEVICES_URI, { logging });

module.exports = {
  dataDB,
  devicesDB
};