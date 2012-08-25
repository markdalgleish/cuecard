#! /usr/bin/env node

var cuecard = require('./cuecard.js'),
	path = require('path'),
	cuecardFile = require(path.join(process.cwd(), '.cuecard.js'));

if (cuecardFile.config) {
	cuecard.create(cuecardFile.config);
}