const { DataTypes: { STRING, INTEGER, DATE, BOOLEAN }, DataTypes } = require('sequelize');
const { dataDB: db } = require('../helpers/db.helper');

const Devices = db.define('Devices', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  NameOfUnit: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  IMEI: {
    type: DataTypes.STRING
  },
  ActualDateUTC: {
    type: DataTypes.DATE
  },
  Latitude: {
    type: DataTypes.DOUBLE
  },
  Longitude: {
    type: DataTypes.DOUBLE
  },
  Altitude: {
    type: DataTypes.DOUBLE
  },
  Speed: {
    type: DataTypes.INTEGER
  },
  Heading: {
    type: DataTypes.INTEGER
  },
  Location: {
    type: DataTypes.STRING
  },
  IgnitionState: {
    type: DataTypes.STRING
  },
  Odometer: {
    type: DataTypes.DOUBLE
  },
  VehicleVIN: {
    type: STRING,
    primaryKey: true
  },
  VehicleLicensePlate: {
    type: STRING,
    primaryKey: true
  }
}, {
  timestamps: false,
  tableName: 'deviceLocations',
});

module.exports = Devices;