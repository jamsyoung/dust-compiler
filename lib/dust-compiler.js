'use strict';

var fs = require('fs'),
    log = require('./log'),
    argv,
    path = require('path'),
    watch = require('watch'),
    wrench = require('wrench'),
    compile = require('./compile'),
    metadata = require('../package.json'),
    optimist = require('optimist'),
    sourcePath,
    destinationPath;

require('colors');

argv = optimist
    .usage('Usage: dust-compiler -s|--source source_path -d|--destination destination_path [--bootstrap] [--nonotify] [--includepath]')
    .alias('source', 's')
    .alias('destination', 'd')
    .alias('version', 'v')
    .alias('help', 'h')
    .describe('source', 'The source .dust templates to watch.')
    .describe('destination', 'The destination destination to write compiles .js files out to.')
    .describe('bootstrap', 'Compiles all files on start.')
    .describe('nonotify', 'Do not notify.')
    .describe('includepath', 'Include the path in the name of the compiled dust template.')
    .describe('version', 'Show the current version installed of dust-compiler')
    .describe('help', 'You are looking at it')
    .argv;

if (argv.v) {
    console.log('dust-compiler v' + metadata.version);
    process.exit(0);
}

if (argv.h) {
    console.log(optimist.help());
    process.exit(0);
}

if (argv.s && argv.d) {
    sourcePath = argv.s.match('/$') ? path.normalize(argv.s) : path.normalize(argv.s + '/');      // must end in slash
    destinationPath = argv.d.match('/$') ? path.normalize(argv.d) : path.normalize(argv.d + '/'); // must end in slash
} else {
    optimist.showHelp();
    console.log('ERROR: '.red + '-s and -d are required arguments');
    process.exit(1);
}

if (argv.nonotify) {
    log = console.log;
}

if (!fs.existsSync(sourcePath)) {
    console.log('ERROR: '.red + sourcePath + ' does not exist');
    process.exit();
}

if (!fs.existsSync(destinationPath)) {
    console.log('ERROR: '.red + destinationPath + ' does not exist');
    process.exit();
}

if (argv.bootstrap) {
    wrench.readdirRecursive(sourcePath, function (error, fileList) {
        if (error) { console.log(error); }

        if (fileList) {
            fileList.forEach(function (filename) {
                compile(filename, sourcePath, destinationPath, argv);
            });
        }
    });
} else {
    watch.createMonitor(sourcePath, function (monitor) {
        log('Watching '.green + sourcePath);
        log('Will write to '.yellow + destinationPath.yellow);
        log('Type ^C to cancel'.yellow);

        monitor.on('created', function (filename) {
            compile(filename, sourcePath, destinationPath, argv);
        });

        monitor.on('changed', function (filename) {
            compile(filename, sourcePath, destinationPath, argv);
        });
    });
}
