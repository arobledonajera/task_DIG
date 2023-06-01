require("dotenv").config();
const { dataDB } = require("./helpers/db.helper");
const tasks = require("./services/tasks.service");
const { mainTaskJob, periodicTaskJob } = require("./services/cron.service");

const start = async () => {
  await dataDB.authenticate();
  console.log("Connected to Data DB");

  await tasks.init();
  console.log("Tasks initialized");

  mainTaskJob.start();

};

start();