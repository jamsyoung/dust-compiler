'use strict';

module.exports = (function log() {
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
