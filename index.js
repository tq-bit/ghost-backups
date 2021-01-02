// Load node modules
const { log } = require('console');
const { green } = require('chalk');
require('dotenv').config()

// Load the backup interval from the configuration
const { backupInterval } = require('./config/config');

// Load the service
const runBackupContent = require('./services/backupContent');

// Start the service with the given interval
log(green(`⏳ Scheduled backup job with a ${backupInterval / (1000 * 60 * 60)} - hour interval`));
runBackupContent();
setInterval(() => runBackupContent(), backupInterval);
