// Load relevant core package functions
const { join } = require('path');
const { readdirSync, readFileSync } = require('fs');
const { log } = require('console');

// Load npm modules
const fetch = require('isomorphic-fetch');
const { red, yellow, green } = require('chalk');

// Load config and utility functions
const { ghostApiUrl, ghostApiPathsRestore, ghostAdminKey, backupDirPath, } = require('../config/config');
const { genAdminHeaders } = require('../config/util');

// TODO: Read the content of the designated backup directory
// TODO: For each file, read its name (name = api path)
// TODO: Add post requests for pages
// TODO: Add post requests for posts