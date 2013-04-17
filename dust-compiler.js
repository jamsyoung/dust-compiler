#! /usr/bin/env node
/*jslint node: true */

/*
 * dust-compiler
 * jmeyoung@gmail.com
 *
 * This is a basic dust compiler, there are many out there. This one adds support
 * for OS X 10.8.x Notification Center to bring more visiblity to compile errors
 * when developing while the terminal window that it is running in is not visible.
 *
 * Usage from terminal for compiling when files change:
 *     ./dust-compiler
 *
 * If you need to compile lots of dust templates for the first time and don't
 * want to start up the compiler then go touch every single file, do this:
 *     ./dust-compiler --bootstrap
 */


var source = "src/main/dust-templates/",             // must end in slash
    destination = "src/main/js/lib/dust-templates/", // must end in slash
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    dust = require('dustjs-linkedin'),
    watch = require('watch'),
    wrench = require('wrench'),
    log = (function () {
        "use strict";
        var notifier;

        // Determine the most-appropriate notifier for the platform.
        switch (process.platform) {
        case "darwin":
            notifier = require("terminal-notifier");
            return function (message) {
                notifier(message, {
                    title: 'Dust Compiler',
                    activate: 'com.apple.Terminal'
                });
                console.log(message);
            };
        case "linux":
            notifier = require("notify-send");
            return function (message) {
                notifier.notify("Dust Compiler", message);
                console.log(message);
            };
        default:
            return console.log;
        }
    }()),
    bootstrap = false;

function compile(src, curr, prev) {
    'use strict';

    var filename,
        filepath,
        error = false,
        data;

    src = path.normalize(src);

    if (path.extname(src) === ".dust") {
        fs.stat(src, function (err, stat) {
            if (err) {
                log("fs.stat error");
                throw err;
            }

            if (!stat.isDirectory()) {

                filename = src.substring(source.length);
                filepath = destination +
                    filename.substring(0, filename.length - 5) + ".js";

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
                                log("mkdirp.mkdirp error: " + err);
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
    "use strict";
    if (idx < 2) { return; }

    switch (arg) {
    case "--bootstrap":
        bootstrap = true;
        break;
    case "--no-notify":
        log = console.log;
        break;
    default:
        log("Ignoring unrecognized option: " + arg);
    }
});

source = path.normalize(source);
destination = path.normalize(destination);

if (bootstrap) {
    wrench.readdirRecursive(source, function (error, fileList) {
        'use strict';

        if (fileList) {
            fileList.forEach(function (filename) {
                compile(source + filename);
            });
        }
    });
} else {
    watch.createMonitor(source, function (monitor) {
        'use strict';

        log('Watching ' + source);
        monitor.on('created', compile);
        monitor.on('changed', compile);
    });
}
