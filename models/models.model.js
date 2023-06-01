const { DataTypes: { STRING, INTEGER } } = require('sequelize');
const { devicesDB: db } = require('../helpers/db.helper');

const Models = db.define('Models', {
  id: {
    type: INTEGER,
    primaryKey: true
  },
  name: STRING,
  description: STRING,
  brandId: INTEGER,
  protocolId: INTEGER
}, {
  timestamps: false,
  tableName: 'models',
});

module.exports = Models;