#! /usr/bin/env node
/*jslint node: true */

'use strict';

var fs = require('fs'),
    log,
    path = require('path'),
    argv = require('optimist')
        .usage('Usage: dust-compiler -s|--source source_path -d|--destination destination_path [--bootstrap] [--nonotify] [--includepath]')
        .demand(['source', 'destination'])
        .alias('source', 's')
        .alias('destination', 'd')
        .describe('source', 'The source .dust templates to watch.')
        .describe('destination', 'The destination destination to write compiles .js files out to.')
        .describe('bootstrap', 'Does not replicate.  Displays the curl command that would be used.')
        .describe('nonotify', 'Do not notify.')
        .describe('includepath', 'Include the path in the name of the compiled dust template.')
        .argv,
    dust = require('dustjs-linkedin'),
    watch = require('watch'),
    colors = require('colors'),
    mkdirp = require('mkdirp'),
    wrench = require('wrench'),
    source = argv.s.match('/$') ? path.normalize(argv.s) : path.normalize(argv.s + '/'),      // must end in slash
    destination = argv.d.match('/$') ? path.normalize(argv.d) : path.normalize(argv.d + '/'); // must end in slash


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
            notifier = require('notify-send');
            return function (message) {
                notifier.notify('Dust Compiler', message.stripColors);
                console.log(message);
            };

        default:
            return console.log;
        }
    }());
}


function compile(src, curr, prev) {
    var data,
        error = false,
        filename,
        filepath,
        compileFilename;

    src = path.normalize(src);

    if (path.extname(src) === '.dust') {
        fs.stat(src, function (err, stat) {
            if (err) {
                log('[ERROR]'.red + ' fs.stat');
                throw err;
            }

            if (!stat.isDirectory()) {

                filename = src.substring(source.length);
                compileFilename = argv.includepath ? destination + filename : filename;
                filepath = destination + filename.substring(0, filename.length - 5) + '.js';

                fs.readFile(src, function (err, data) {
                    if (err) {
                        log('[ERROR]'.red + ' fs.readFile');
                        throw err;
                    }

                    try {
                        data = dust.compile(data.toString(), compileFilename);
                    } catch (e) {
                        error = true;
                        log(e);
                    }

                    if (!error) {
                        mkdirp.mkdirp(path.dirname(filepath), function (err) {
                            if (err) {
                                log('[ERROR]'.red + ' mkdirp.mkdirp: ' + err);
                                throw err;
                            }

                            fs.writeFile(filepath, data, function (err) {
                                if (err) {
                                    log('[ERROR]'.red + ' fs.writeFile: ' + err);
                                    throw err;
                                }
                                log('Compiled '.green + filepath + ' as '.green + compileFilename);
                            });
                        });
                    }
                });
            }
        });
    }
}



if (argv.bootstrap) {
    wrench.readdirRecursive(source, function (error, fileList) {
        if (fileList) {
            fileList.forEach(function (filename) {
                compile(source + filename);
            });
        }
    });
}


if (!fs.existsSync(source)) {
    console.log('[ERROR]'.red + ' ' + source + ' does not exist');
    process.exit();
}


if (!fs.existsSync(destination)) {
    console.log('[ERROR]'.red + ' ' + destination + ' does not exist');
    process.exit();
}


watch.createMonitor(source, function (monitor) {
    log('Watching '.green + source);
    log('Will write to '.yellow + destination.yellow);
    log('Type ^C to cancel'.yellow);

    monitor.on('created', compile);
    monitor.on('changed', compile);
});
