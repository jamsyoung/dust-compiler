#! /usr/bin/env node
/*jslint node: true */

'use strict';

var source = 'change-me/',      // must end in slash
    destination = 'change-me/', // must end in slash
    fs = require('fs'),
    log,
    path = require('path'),
    mkdirp = require('mkdirp'),
    dust = require('dustjs-linkedin'),
    watch = require('watch'),
    wrench = require('wrench'),
    bootstrap = false;


log = (function () {
    var notifier;

    switch (process.platform) {
    case 'darwin':
        notifier = require('terminal-notifier');
        return function (message) {
            notifier(message, {
                title: 'Dust Compiler',
                activate: 'com.apple.Terminal'
            });
            console.log(message);
        };

    case 'linux':
        notifier = require('notify-send');
        return function (message) {
            notifier.notify('Dust Compiler', message);
            console.log(message);
        };

    default:
        return console.log;
    }
}());



function compile(src, curr, prev) {
    var filename,
        filepath,
        error = false,
        data;

    src = path.normalize(src);

    if (path.extname(src) === '.dust') {
        fs.stat(src, function (err, stat) {
            if (err) {
                log('fs.stat error');
                throw err;
            }

            if (!stat.isDirectory()) {

                filename = src.substring(source.length);
                filepath = destination + filename.substring(0, filename.length - 5) + '.js';

                fs.readFile(src, function (err, data) {
                    if (err) {
                        log('fs.readFile error');
                        throw err;
                    }

                    try {
                        data = dust.compile(data.toString(), filename);
                    } catch (e) {
                        error = true;
                        log(e);
                    }

                    if (!error) {
                        mkdirp.mkdirp(path.dirname(filepath), function (err) {
                            if (err) {
                                log('mkdirp.mkdirp error: ' + err);
                                throw err;
                            }

                            fs.writeFile(filepath, data, function (err) {
                                if (err) {
                                    log('fs.writeFile error: ' + err);
                                    throw err;
                                }
                                log('Saved ' + filepath);
                            });
                        });
                    }
                });
            }
        });
    }
}


process.argv.forEach(function (arg, idx) {
    if (idx < 2) { return; }

    switch (arg) {
    case '--bootstrap':
        bootstrap = true;
        break;

    case '--no-notify':
        log = console.log;
        break;

    default:
        log('Ignoring unrecognized option: ' + arg);
    }
});


source = path.normalize(source);
destination = path.normalize(destination);


if (bootstrap) {
    wrench.readdirRecursive(source, function (error, fileList) {
        if (fileList) {
            fileList.forEach(function (filename) {
                compile(source + filename);
            });
        }
    });
} else {
    watch.createMonitor(source, function (monitor) {
        log('Watching ' + source);
        monitor.on('created', compile);
        monitor.on('changed', compile);
    });
}
