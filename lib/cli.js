#! /usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	colors = require('colors'),
	program = require('commander'),
	async = require('async'),
	ejs = require('ejs'),
	adapters = require('./adapters'),
	Presentation = require('./presentation').Presentation;

var CUECARD_FILE_NAME = 'cuecard.js';

program
	.option('-i, --init', 'Create a new presentation')
	.parse(process.argv);

if (program.init) {
	console.log();
	console.log('Cuecard Presentation Generator'.green);

	var cwd = process.cwd(),
		dirname = cwd.split(path.sep)[cwd.split(path.sep).length - 1];

	var presentation = new Presentation({
		title: dirname,
		hasRemote: false,
		remoteUrl: '/remote'
	});
	
	var adapterKeys = Object.keys(adapters);
	var adapterNames = adapterKeys.map(function(adapter) {
		return adapters[adapter].name;
	});

	var promptForAdapter = function(asyncCallback) {
		console.log();
		console.log('Presentation framework? '.grey + '(' + adapters[presentation.adapter].name + ')');
		program.choose(adapterNames, adapterKeys.indexOf(presentation.adapter), function(i) {
			presentation.adapter = adapterKeys[i];
			asyncCallback();
		});
	};

	var promptForTitle = function(asyncCallback) {
		console.log();
		program.prompt('Presentation title? '.grey + '(' + presentation.title + ') ', function(title) {
			presentation.title = title || presentation.title;
			asyncCallback();
		});
	};

	var promptForPort = function(asyncCallback) {
		console.log();
		program.prompt('Which port should the Cuecard server run on? '.grey + '(' + presentation.port + ') ', function(port) {
			presentation.port = port || presentation.port;
			asyncCallback();
		});
	};

	var promptForRemote = function(asyncCallback) {
		console.log();
		program.prompt('Allow remote access? '.grey + (presentation.hasRemote ? '(Y/n)' : '(y/N)') + ' ', function(ok) {
			ok = ok && ok.toLowerCase() || (presentation.hasRemote ? 'y' : 'n');
			presentation.hasRemote = ok === 'y' || ok === 'yes';

			if (presentation.hasRemote) {
				console.log();
				program.prompt('Remote URL? '.grey + '(' + presentation.remoteUrl + ') ', function(remoteUrl) {
					presentation.remoteUrl = remoteUrl || presentation.remoteUrl;
					asyncCallback();
				});
			} else {
				asyncCallback();
			}
		});
	};

	var askQuestions = function() {
		async.series([
			promptForAdapter,
			promptForTitle,
			promptForPort,
			promptForRemote
		], function() {
			confirmpresentation();
		});
	};

	var confirmpresentation = function(asyncCallback) {
		console.log();
		console.log('Please confirm your presentation:'.green);
		console.log();
		console.log(' * Framework: '.grey + adapters[presentation.adapter].name);
		console.log(' * Title: '.grey + presentation.title);
		console.log(' * Port: '.grey + presentation.port);
		if (presentation.hasRemote && presentation.remoteUrl) {
			console.log(' * Remote URL: '.grey + presentation.remoteUrl);
		}

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

		async.parallel({
			adapter: function(asyncCallback) {
				adapters[presentation.adapter].load(asyncCallback);
			},
			packageJson: function(asyncCallback) {
				fs.readFile(path.join(__dirname, 'boilerplate/package.json.ejs'), 'utf8', function(err, results) {
					asyncCallback(err, ejs.render(results, presentation));
				});
			},
			cuecardFile: function(asyncCallback) {
				fs.readFile(path.join(__dirname, 'boilerplate/cuecard.js.ejs'), 'utf8', function(err, results) {
					asyncCallback(err, ejs.render(results, presentation));
				});
			}
		}, function(err, results) {
			var adapter = results.adapter;

			var writeFile = function(filename, content) {
				return function(asyncCallback) {
					fs.writeFile(path.join(process.cwd(), filename), content, function(err) {
						console.log('Creating ' + filename + '... ' + (err ? 'ERROR'.red : 'DONE'.green));
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
				mkdir('static'),
				mkdir('static/js'),
				writeFile('static/js/script.js', adapter.boilerplate.js),
				mkdir('node_modules'),
				mkdir('node_modules/cuecard')
			], function(err) {
				console.log();

				if (err) {
					console.log('ERROR: '.red + 'Failed to write one or more files/directories.');
					process.exit();
				} else {
					process.stdout.write('Installing local copy of Cuecard... ');

					wrench.copyDirRecursive(path.join(__dirname, '..'), path.join(process.cwd(), 'node_modules/cuecard'), function(err, files) {
						if (err) {
							process.stdout.write('ERROR'.red);
						} else {
							process.stdout.write('DONE'.green);

							console.log();
							console.log();
							console.log('Presentation successfully generated'.green);
							console.log();
							console.log('Run ' + '"cuecard"'.grey + ' or ' + '"node cuecard.js"'.grey + ' to start server');
							console.log();
						}

						process.exit();
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