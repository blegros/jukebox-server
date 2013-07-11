module.exports = function (environment) {
    console.log("Found " + environment + " environment.");
    return require('./' + environment + '.json');
};