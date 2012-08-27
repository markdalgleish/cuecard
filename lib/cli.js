#! /usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	colors = require('colors'),
	program = require('commander'),
	async = require('async'),
	ejs = require('ejs'),
	adapters = require('./adapters');

var CUECARD_FILE_NAME = 'cuecard.js';

program
	.option('-i, --init', 'Create a new presentation')
	.parse(process.argv);

if (program.init) {
	console.log();
	console.log('Cuecard Presentation Generator'.green);

	var cwd = process.cwd(),
		dirname = cwd.split(path.sep)[cwd.split(path.sep).length - 1];
	
	var frameworks = Object.keys(adapters);

	var choices = {
		framework: 0,
		title: dirname,
		port: 3000,
		hasRemote: true,
		remoteUrl: '/remote'
	};

	var promptForFramework = function(asyncCallback) {
		console.log();
		console.log('Presentation framework? '.grey + '(' + frameworks[choices.framework] + ')');
		program.choose(frameworks, choices.framework, function(i) {
			choices.framework = i;
			asyncCallback();
		});
	};

	var promptForTitle = function(asyncCallback) {
		console.log();
		program.prompt('Presentation title? '.grey + '(' + choices.title + ') ', function(title) {
			choices.title = title || choices.title;
			asyncCallback();
		});
	};

	var promptForPort = function(asyncCallback) {
		console.log();
		program.prompt('Which port should the Cuecard server run on? '.grey + '(' + choices.port + ') ', function(port) {
			choices.port = port || choices.port;
			asyncCallback();
		});
	};

	var promptForRemote = function(asyncCallback) {
		console.log();
		program.prompt('Allow remote access? '.grey + '(Y/n) ', function(ok) {
			ok = ok && ok.toLowerCase() || 'y';
			choices.hasRemote = ok === 'y' || ok === 'yes';

			if (choices.hasRemote) {
				console.log();
				program.prompt('Remote URL? '.grey + '(' + choices.remoteUrl + ') ', function(remoteUrl) {
					choices.remoteUrl = remoteUrl || choices.remoteUrl;
					asyncCallback();
				});
			} else {
				asyncCallback();
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

	var confirmChoices = function(asyncCallback) {
		console.log();
		console.log('Please confirm your choices:'.green);
		console.log();
		console.log(' * Framework: '.grey + frameworks[choices.framework]);
		console.log(' * Title: '.grey + choices.title);
		console.log(' * Port: '.grey + choices.port);
		choices.hasRemote && choices.remoteUrl && console.log(' * Remote URL: '.grey + choices.remoteUrl);

		console.log();
		program.prompt('Is this okay? '.grey + '(Y/n) ', function(ok) {
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
		console.log();

		choices.adapter = frameworks[choices.framework].toLowerCase().replace('.js', '');

		async.parallel({
			adapter: function(asyncCallback) {
				adapters[frameworks[choices.framework]].load(asyncCallback);
			},
			packageJson: function(asyncCallback) {
				fs.readFile(path.join(__dirname, 'boilerplate/package.json.ejs'), 'utf8', function(err, results) {
					asyncCallback(err, ejs.render(results, choices));
				});
			},
			cuecardFile: function(asyncCallback) {
				fs.readFile(path.join(__dirname, 'boilerplate/cuecard.js.ejs'), 'utf8', function(err, results) {
					asyncCallback(err, ejs.render(results, choices));
				});
			}
		}, function(err, results) {
			var adapter = results.adapter;

			var writeFile = function(filename, content) {
				return function(asyncCallback) {
					fs.writeFile(path.join(process.cwd(), filename), content, function(err) {
						console.log('Writing ' + filename + '... ' + (err ? 'ERROR'.red : 'DONE'.green));
						asyncCallback(err);
					});
				};
			};

			var mkdir = function(dirname) {
				return function(asyncCallback) {
					fs.mkdir(path.join(process.cwd(), dirname), function(err) {
						console.log('Creating ' + dirname + ' directory... ' + (err ? 'ERROR'.red : 'DONE'.green));
						asyncCallback(err);
					});
				};
			};

			async.series([
				writeFile('package.json', results.packageJson),
				writeFile(CUECARD_FILE_NAME, results.cuecardFile),
				writeFile('slides.html', adapter.boilerplate.html),
				writeFile('slides.css', adapter.boilerplate.css),
				mkdir('static')
			], function(err) {
				console.log();

				if (err) {
					console.log('ERROR: '.red + 'Failed to write one or more files/directories.');
					process.exit();
				} else {
					console.log('Installing Cuecard from npm... ');

					var child = exec('npm install', function(err, stdout, stderr) {
						if (stdout.indexOf('node_modules/cuecard') >= 0) {
							console.log('Installing Cuecard from npm... ' + 'DONE'.green);
							console.log();

							console.log('Success! Your presentation is ready to be populated!'.green);
							console.log();
							console.log(' * Slide markup goes in '.grey + 'slides.html');
							console.log(' * Presentation styles go in '.grey + 'slides.css');
							console.log(' * Static files go in the '.grey + 'static' + ' directory'.grey);
							console.log(' * Edit Cuecard settings in '.grey + 'cuecard.js');
							console.log();
							console.log('Start the Cuecard server by running '.grey + 'cuecard ' + 'or '.grey + 'node cuecard.js');
							console.log();

							process.exit();
						}
					});
				}
			});
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