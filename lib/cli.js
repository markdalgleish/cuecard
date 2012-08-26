#! /usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	colors = require('colors'),
	program = require('commander'),
	async = require('async');

var CUECARD_FILE_NAME = 'cuecard.js';

program
	.option('-i, --init', 'Create a new presentation')
	.parse(process.argv);

if (program.init) {
	console.log();
	console.log('Cuecard Presentation Generator'.green);

	var cwd = process.cwd(),
		dirname = cwd.split(path.sep)[cwd.split(path.sep).length - 1];
	
	var frameworks = ['Fathom.js', 'Reveal.js'];

	var choices = {
		framework: 0,
		title: dirname,
		port: 3000,
		hasRemote: true,
		remoteUrl: '/remote'
	};

	var promptForFramework = function(callback) {
		console.log();
		console.log('Presentation framework? '.grey + '(' + frameworks[choices.framework] + ')');
		program.choose(frameworks, choices.framework, function(i) {
			choices.framework = i;
			callback();
		});
	};

	var promptForTitle = function(callback) {
		console.log();
		program.prompt('Presentation title? '.grey + '(' + choices.title + ') ', function(title) {
			choices.title = title || choices.title;
			callback();
		});
	};

	var promptForPort = function(callback) {
		console.log();
		program.prompt('Which port should the Cuecard server run on? '.grey + '(' + choices.port + ') ', function(port) {
			choices.port = port || choices.port;
			callback();
		});
	};

	var promptForRemote = function(callback) {
		console.log();
		program.prompt('Allow remote access? '.grey + '(yes) ', function(ok) {
			ok = ok && ok.toLowerCase() || 'y';
			choices.hasRemote = ok === 'y' || ok === 'yes';

			if (choices.hasRemote) {
				console.log();
				program.prompt('Remote URL? '.grey + '(' + choices.remoteUrl + ') ', function(remoteUrl) {
					choices.remoteUrl = remoteUrl || choices.remoteUrl;
					callback();
				});
			} else {
				callback();
			}
		});
	};

	var askQuestions = function() {
		async.series([
			promptForFramework,
			promptForTitle,
			promptForPort,
			promptForRemote
		], function() {
			confirmChoices();
		});
	};

	var confirmChoices = function(callback) {
		console.log();
		console.log('Please confirm your choices:'.green);
		console.log();
		console.log(' * Framework: '.grey + frameworks[choices.framework]);
		console.log(' * Title: '.grey + choices.title);
		console.log(' * Port: '.grey + choices.port);
		choices.hasRemote && choices.remoteUrl && console.log(' * Remote URL: '.grey + choices.remoteUrl);

		console.log();
		program.prompt('Is this okay? '.grey + '(yes) ', function(ok) {
			ok = ok && ok.toLowerCase() || 'y';

			if (ok === 'y' || ok === 'yes') {
				createBoilerplate();
			} else {
				console.log();
				console.log("Not okay! Let's try this again...".green);
				askQuestions();
			}
		});
	};

	var createBoilerplate = function() {
		async.series([
			function(callback) {
				fs.writeFile(path.join(process.cwd(), 'package.json'), '', function(err) {
					callback(err);
				});
			},
			function(callback) {
				fs.writeFile(path.join(process.cwd(), CUECARD_FILE_NAME), '', function(err) {
					callback(err);
				});
			},
			function(callback) {
				fs.writeFile(path.join(process.cwd(), 'slides.html'), '', function(err) {
					callback(err);
				});
			},
			function(callback) {
				fs.writeFile(path.join(process.cwd(), 'slides.css'), '', function(err) {
					callback(err);
				});
			},
			function(callback) {
				fs.mkdir(path.join(process.cwd(), 'static'), function(err) {
					callback(err);
				});
			}
		], function(err) {
			console.log();
			if (err) {
				console.log('ERROR: '.red + 'Failed to write files.');
			} else {
				console.log('Success! Your presentation is ready to be populated!'.green);
				console.log();
				console.log(' * Slide markup goes in '.grey + 'slides.html');
				console.log(' * Presentation styles go in '.grey + 'slides.css');
				console.log(' * Static files go in the '.grey + 'static' + ' directory'.grey);
				console.log(' * Edit Cuecard settings in '.grey + 'cuecard.js');
				console.log();
				console.log('Start the Cuecard server by running '.grey + 'cuecard ' + 'or '.grey + 'node cuecard.js');
				console.log();
			}

			process.exit();
		});
	};

	askQuestions();
} else {
	var cuecardFilePath = path.join(process.cwd(), CUECARD_FILE_NAME);

	fs.exists(cuecardFilePath, function(exists) {
		if (exists) {
			require(cuecardFilePath); // Run cuecard.js
		} else {
			console.log('ERROR: '.red + 'Unable to find "' + CUECARD_FILE_NAME + '".');
			console.log('Did you mean to run ' + 'cuecard init'.green + '?');
		}
	});
}