const { Op } = require('sequelize');
const { Devices, Models, Protocols, Changes, GTReports, Reports } = require('../models');
const {
  MAX_REPORTS
} = process.env; 

const findDevices = async ({ protocolId }) => {
    return await Devices.findAll();
};

const findReports = async (lastId = 0, imeis) => {
  return await Reports.findAll({
    where: {
      id: {
        [Op.gt]: lastId
      },
      imei: {
        [Op.in]: imeis
      },
    },
    order: [['id', 'ASC']],
    limit: MAX_REPORTS
  });
};

const findGTReports = async () => {
  return await GTReports.findAll();
};

const findChanges = async (imeis) => {
  return await Changes.findAll({
    where: {
      imei: {
        [Op.in]: imeis
      }
    }
  });
};

const addChange = async (change) => {
  return await Changes.create(change);
};

const updateChange = async (change) => {
  return await change.save();
};

module.exports = {
  findDevices,
  findReports,
  findGTReports,
  findChanges,
  addChange,
  updateChange
};