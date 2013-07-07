module.exports = function (models) {
    "use strict";

    var fileSystem = require('fs'),
        controllers = {};

    //read each controller file and add to object to return
    fileSystem.readdirSync(__dirname)
        .filter(function (filename) {
            var isHidden = /^\./.test(filename);
            return !isHidden && filename !== 'index.js';
        })
        .forEach(function (filename) {
            console.log('Loading controller @ ' + filename + " ...");

            var controller = require('./' + filename)(models);
            var name = filename.replace(/\.js$/i, "");
            controllers[name] = controller;
        });

    return controllers;
};