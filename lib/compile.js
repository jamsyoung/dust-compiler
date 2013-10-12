'use strict';

var fs = require('fs'),
    log = require('./log'),
    dust = require('dustjs-linkedin'),
    path = require('path'),
    mkdirp = require('mkdirp');


/**
 *  compile
 *
 * options rexpects { includepath: true, nonotify: true }
 *
 */
module.exports = function compile(sourcePath, sourceFilename, destinationPath, options) {
    var source = path.normalize(sourcePath + sourceFilename),
        errorFlag = false,
        filename,
        basename,
        filepath,
        compileFilename;

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

                filename = source.substring(sourcePath.length);
                basename = filename.substring(0, filename.length - 5);
                filepath = destinationPath + basename + '.js';
                compileFilename = options.includepath ? sourcePath + basename : basename;

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
};
