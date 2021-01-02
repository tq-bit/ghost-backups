// Import the necessary functions
const { promises } = require('fs');
const { sign } = require('jsonwebtoken');
const rimraf = require('rimraf');

/**
 * @desc 	Create the authorization header to authenticate against the
 * 				Ghost admin-endpoint
 *
 * @param {String} ghostAdminKey
 *
 * @returns {Object} The headers to be appended to the http request
 */
function genAdminHeaders(ghostAdminKey) {
	// Extract the secret from the Ghost admin key
	const [id, secret] = ghostAdminKey.split(':');

	// Create a token with an empty payload and encode it.
	const token = sign({}, Buffer.from(secret, 'hex'), {
		keyid: id,
		algorithm: 'HS256',
		expiresIn: '5m',
		audience: '/v3/admin',
	});

	// Create the headers object that's added to the request
	const headers = {Authorization: `Ghost ${token}`}

	return headers;
}

/**
 * @desc 	Delete backup directories that are older than the backupLifetime.
 *
 * @param {String} dirPath The path to where backups are being stored
 * @param {Number} backupLifetime The amount of months a backup is to be stored
 *
 * @returns {Array} An array of paths that have been deleted
 */

async function deleteOldDirectories(dirPath, backupLifetime) {
	const dir = await promises.opendir(dirPath);
	let deletedBackups = [];

	for await (const dirent of dir) {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;

		// For each backup entry, extract the year and month in which is was created
		const createdYear = +dirent.name.split('_')[0];
		const createdMonth = +dirent.name.split('_')[1];

		// In case backup was made this year,
		// check if createdMonth + lifetime are less than current month
		if (createdYear === year) {
			if (createdMonth - backupLifetime >= month) {
				deletedBackups.push(dirent.name)
				rimraf.sync(`${dirPath}/${dirent.name}`)
			}
		}

		// In case backup was made last year,
		// check if createdMonth + lifetime is smaller than 12
		else {
			if (createdMonth + backupLifetime <= 12) {
				deletedBackups.push(dirent.name)
				rimraf.sync(`${dirPath}/${dirent.name}`)
			}
		}
	}

	return deletedBackups;
}

module.exports = { genAdminHeaders, deleteOldDirectories };
