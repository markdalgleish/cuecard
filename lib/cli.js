#! /usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	colors = require('colors');

var CUECARD_FILE_NAME = 'cuecard.js';

var cuecardFilePath = path.join(process.cwd(), CUECARD_FILE_NAME);

fs.exists(cuecardFilePath, function(exists) {
	if (exists) {
		require(cuecardFilePath); // Run cuecard.js
	} else {
		console.log('ERROR: '.red + CUECARD_FILE_NAME.yellow + ' not found.'.yellow);
	}
});