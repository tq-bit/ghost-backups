const { join } = require('path');

// Configure the relevant API params
const ghostApiUrl = process.env.ghostApiUrl;
const ghostApiPaths = ['posts', 'pages', 'site', 'users'];
const ghostAdminKey = process.env.ghostAdminKey;

// Configure the backup settings
const backupInterval = 1000 /* Miliseconds */ * 60 /* Seconds */ * 60 /* Minutes */ * 24 /* Hours*/ * 1; /* Days */
const backupDirPath = process.env.backupDirPath;
const backupLifetime = 4; /* Months */

// Create the unique directory path for a particular backup job
const genBackupDirPath = () => {
	const date = new Date();

	// Create a timestamp for the directory that's to be created
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, 0);
	const day = date.getDate().toString().padStart(2, 0);
	const hour = date.getHours().toString().padStart(2, 0);
	const min = date.getMinutes().toString().padStart(2, 0);
	const now = `${year}_${month}_${day}-${hour}_${min}`;

	return join(backupDirPath, now);
};

module.exports = {
	ghostApiUrl,
	ghostApiPaths,
	ghostAdminKey,
	backupInterval,
	backupLifetime,
	backupDirPath,
	genBackupDirPath,
};
