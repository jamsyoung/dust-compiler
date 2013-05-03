#! /usr/bin/env node
/*jslint node: true */

'use strict';

var fs = require('fs'),
    log,
    argv,
    dust = require('dustjs-linkedin'),
    path = require('path'),
    watch = require('watch'),
    colors = require('colors'),
    mkdirp = require('mkdirp'),
    wrench = require('wrench'),
    metaData = require('./package.json'),
    optimist = require('optimist'),
    sourcePath,
    destinationPath;

argv = optimist
    .usage('Usage: dust-compiler -s|--source source_path -d|--destination destination_path [--bootstrap] [--nonotify] [--includepath]')
    .alias('source', 's')
    .alias('destination', 'd')
    .alias('version', 'v')
    .describe('source', 'The source .dust templates to watch.')
    .describe('destination', 'The destination destination to write compiles .js files out to.')
    .describe('bootstrap', 'Does not replicate.  Displays the curl command that would be used.')
    .describe('nonotify', 'Do not notify.')
    .describe('includepath', 'Include the path in the name of the compiled dust template.')
    .describe('version', 'Show the current version installed of dust-compiler')
    .argv;

if (argv.v) {
    console.log('dust-compiler v' + metaData.version);
    process.exit();
}

if (argv.s && argv.d) {
    sourcePath = argv.s.match('/$') ? path.normalize(argv.s) : path.normalize(argv.s + '/'),      // must end in slash
    destinationPath = argv.d.match('/$') ? path.normalize(argv.d) : path.normalize(argv.d + '/'); // must end in slash
} else {
    optimist.showHelp();
    console.log('ERROR: '.red + '-s and -d are required arguments');
    process.exit();
}

if (argv.nonotify) {
    log = console.log;
} else {
    log = (function () {
        var notifier;

        switch (process.platform) {
        case 'darwin':
            notifier = require('terminal-notifier');
            return function (message) {
                notifier(message.stripColors, {
                    title: 'Dust Compiler',
                    activate: 'com.apple.Terminal'
                });
                console.log(message);
            };

        case 'linux':
        case 'win32':
            notifier = require('growl');
            return function (message) {
                notifier(message.stripColors, { title: 'Dust Compiler' });
                console.log(message);
            };

        default:
            return console.log;
        }
    }());
}


function compile(source, currentStat, previousStat) {
    var data,
        errorFlag = false,
        filename,
        basename,
        filepath,
        compileFilename;

    source = path.normalize(source);

    if (path.extname(source) === '.dust') {
        fs.stat(source, function (error, stat) {
            if (error) {
                log('ERROR: '.red + 'fs.stat: ' + error.message);
                throw error;
            }

            if (!stat.isDirectory()) {

                filename = source.substring(sourcePath.length);
                basename = filename.substring(0, filename.length - 5);
                filepath = destinationPath + basename + '.js';
                compileFilename = argv.includepath ? sourcePath + basename : basename;

                fs.readFile(source, function (error, data) {
                    if (error) {
                        log('ERROR: '.red + 'fs.readFile: ' + error.message);
                        throw error;
                    }

                    try {
                        data = dust.compile(data.toString(), compileFilename);
                    } catch (err) {
                        /* error is passed into fs.readFile, so this catch can't be on error */
                        errorFlag = true;
                        log('ERROR: '.red + compileFilename.red + ': ' + err.message);
                    }

                    if (!errorFlag) {
                        mkdirp.mkdirp(path.dirname(filepath), function (error) {
                            if (error) {
                                log('ERROR: '.red + 'mkdirp.mkdirp: ' + error.message);
                                throw error;
                            }

                            fs.writeFile(filepath, data, function (error) {
                                if (error) {
                                    log('ERROR: '.red + 'fs.writeFile: ' + error.message);
                                    throw error;
                                }
                                log('Compiled '.green + sourcePath + filename + ' as '.green + compileFilename);
                            });
                        });
                    }
                });
            }
        });
    }
}



if (argv.bootstrap) {
    wrench.readdirRecursive(sourcePath, function (error, fileList) {
        if (fileList) {
            fileList.forEach(function (filename) {
                compile(sourcePath + filename);
            });
        }
    });
}


if (!fs.existsSync(sourcePath)) {
    console.log('ERROR: '.red + sourcePath + ' does not exist');
    process.exit();
}


if (!fs.existsSync(destinationPath)) {
    console.log('ERROR: '.red + destinationPath + ' does not exist');
    process.exit();
}


watch.createMonitor(sourcePath, function (monitor) {
    log('Watching '.green + sourcePath);
    log('Will write to '.yellow + destinationPath.yellow);
    log('Type ^C to cancel'.yellow);

    monitor.on('created', compile);
    monitor.on('changed', compile);
});
