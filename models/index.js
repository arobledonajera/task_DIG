const Devices = require('./devices.model');
const Models = require('./models.model');

// Devices.belongsTo(Models, { foreignKey: 'id' });
// Models.belongsTo(Devices, { foreignKey: 'id' });

module.exports = {
  Devices,
  Models
};