'use strict';

var fs = require('fs'),
    log = require('log-notify'),
    dust = require('dustjs-linkedin'),
    path = require('path'),
    debug = require('debug')('compile'),
    mkdirp = require('mkdirp');


module.exports = function compile(sourceFilename, sourcePath, destinationPath, options) {
    var source,
        basename,
        filepath,
        errorFlag = false,
        compileFilename;

    sourcePath = sourcePath || './';
    sourceFilename = sourceFilename || '';
    destinationPath = destinationPath || './';
    options = options || {};
    options.includepath = options.includepath || false;
    options.nonotify = options.nonotify || false;
    options.amd = options.amd || false;

    debug('compile called with options: %s, %s, %s, %j', sourceFilename, sourcePath, destinationPath, options);

    source = path.normalize(sourcePath + sourceFilename);

    if (options.nonotify) {
        log = console.log;
    }

    if (path.extname(source) === '.dust') {
        fs.stat(source, function (error, stat) {
            if (error) {
                log('ERROR: '.red + 'fs.stat: ' + error.message);
                throw error;
            }

            if (!stat.isDirectory()) {

                basename = sourceFilename.substring(0, sourceFilename.length - 5);
                filepath = destinationPath + basename + '.js';
                compileFilename = options.includepath ? sourcePath + basename : basename;

                fs.readFile(source, function (error, data) {
                    if (error) {
                        log('ERROR: '.red + 'fs.readFile: ' + error.message);
                        throw error;
                    }

                    try {
                        data = dust.compile(data.toString(), compileFilename);

                        if (options.amd) {
                            data = 'define(["dust"], function() { dust = require("dust"); ' + data + '});';
                        }
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
                                log('Compiled '.green + sourcePath + sourceFilename + ' as '.green + compileFilename);
                            });
                        });
                    }
                });
            }
        });
    }
};
