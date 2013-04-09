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
    }());

function compile(path, curr, prev) {
    'use strict';

    var filename = path.split('/').reverse()[0].replace('.dust', ''),
        filepath = destination + filename + '.js',
        error = false,
        data;

    fs.readFile(path, function (err, data) {
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
            fs.writeFile(filepath, data, function (err) {
                if (err) {
                    log('fs.writeFile error: ' + err);
                    throw err;
                }
                log('Saved ' + filepath);
            });
        }
    });
}


if (process.argv[2] === '--bootstrap') {
    wrench.readdirRecursive(source, function (error, fileList) {
        'use strict';

        if (fileList) {
            for (var i = 0; i < fileList.length; i++) {
                compile(source + fileList[i]);
            }
        }
    });
} else {
    watch.createMonitor(source, function (monitor) {
        'use strict';

        log('Watching ' + source);
        monitor.files['*.dust', '*/*'];
        monitor.on('created', compile);
        monitor.on('changed', compile);
    });
}
