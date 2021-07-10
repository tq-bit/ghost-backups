// Load relevant core package functions
const { join } = require('path');
const { mkdirSync, writeFileSync } = require('fs');
const { log } = require('console');

// Load npm modules
const fetch = require('isomorphic-fetch');
const { red, yellow, green } = require('chalk');

// Load config and utility functions
const { ghostApiUrl, ghostApiPaths, ghostAdminKey, backupDirPath, genBackupDirPath, backupLifetime } = require('../config/config');
const { genAdminHeaders, deleteOldDirectories } = require('../config/util');

// Main function for the backup service
async function runBackupContent() {
	log(green(`⏳ Time to backup your content. Timestamp: ${new Date()}`));
	try {
		// Generate the backup directory and the authorization headers
		const dir = genBackupDirPath();
		const headers = genAdminHeaders(ghostAdminKey);

		// e.g. /home/pi/Backups/2021_01_02-13_55/site.json
		mkdirSync(dir);

		// Check for old backups and clean them up
		const deleted = await deleteOldDirectories(backupDirPath, backupLifetime);
		if (deleted.length > 0) {
			deleted.forEach(deletedBackup => log(yellow(`☝ Deleted backup from ${deletedBackup}`)));
		} else {
			log(green('✅ No old backups to be deleted'));
		}

		// Make a backup for all the content specified in the api paths config
		ghostApiPaths.forEach(async path => {
			// Create the relevant variables

			// The endpoint from where to receive backup data
			// e.g. https://<your-ghost-domain>/ghost/api/v3/admin/posts
			const url = `${ghostApiUrl}/${path}`;

			// These options.headers will hold the Json Webtoken
			// e.g. 'Authorization': 'Ghost eybf12bf.8712dh.128d7g12'
			const options = { method: 'get', timeout: 1500, headers: { ...headers } };

			// The name of the corresponding backup file in json
			// e.g. posts.json
			const filePath = join(dir, path + '.json');
			console.log(url)
			const response = await fetch(url, options);

			// If the http status is unexpected, log the error down in a separate file
			if (response.status !== 200) {
				const errPath = join(dir, path + 'error.json');
				const data = await response.json();
				writeFileSync(errPath, JSON.stringify(data));
				log(red(`❌ ${new Date()}: Something went wrong while trying to backup ${path}`));

				// If the http status is returned as expected, write the result to a file
			} else {
				const data = await response.json();
				writeFileSync(filePath, JSON.stringify(data));
				log(green(`✅ Wrote backup for '${path}' - endpoint into ${filePath}`));
			}
		});
	} catch (e) {
		// Do appropriate error handling based on the response code
		switch (e.code) {
			// If, for some reason, two backups are made at the same time
			case 'EEXIST':
				log(red('❌ Tried to execute a backup for the same time period twice. Cancelling ... '));
				break;
			default:
				log(red(e.message));
				break;
		}
	}
}

module.exports = runBackupContent;
