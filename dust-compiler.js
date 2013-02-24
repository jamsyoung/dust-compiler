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
 * Usage from terminal:
 *     ./dust-compiler
 */


var source = "src/main/dust-templates/",
    destination = "src/main/js/lib/dust-templates",
    fs = require('fs'),
    dust = require('dustjs-linkedin'),
    watch = require('watch'),
    notifier = require('terminal-notifier'),
    wrench = require('wrench');




if (process.argv[2] === '--bootstrap') {
    wrench.readdirRecursive(source, function (error, fileList) {
        'use strict';

        if (fileList) {
            for (var i = 0; i < fileList.length; i++) {
                console.log(fileList[i]);
            }
        }
    });
    process.exit(0);
}


function log(message) {
    'use strict';

    if (process.platform === 'darwin') {
        notifier(message, {
            title: 'Dust Compiler',
            activate: 'com.apple.Terminal'
        });
    }

    console.log(message);
}


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


watch.createMonitor(source, function (monitor) {
    'use strict';

    log('Watching ' + source);
    monitor.files['*.dust', '*/*'];
    monitor.on('created', compile);
    monitor.on('changed', compile);
});
