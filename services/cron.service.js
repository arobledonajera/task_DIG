const { CronJob } = require('cron');
const tasks = require('./tasks.service');
const {
  CRONTIME_MAIN,
  CRONTIME_PERIODIC,
  TIMEZONE
} = process.env;

const mainTaskJob = new CronJob(CRONTIME_MAIN, async () => {
  mainTaskJob.stop();
  const error = await tasks.main();
  
  mainTaskJob.start();
});

const periodicTaskJob = new CronJob(CRONTIME_PERIODIC, tasks.periodicMetrics, null, false, TIMEZONE);

module.exports = {
  mainTaskJob,
  periodicTaskJob
};