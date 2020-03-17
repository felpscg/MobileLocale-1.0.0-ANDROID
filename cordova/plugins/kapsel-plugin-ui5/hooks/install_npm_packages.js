#!/usr/bin/env node

// declare dependencies in package.json of the plugin, e.g.:
//
//  "dependencies": {
//    "shelljs" : "~0.8.3"
//  }
//

module.exports = function (context) {

    var cp = require('child_process'),
      path = require('path');
    
    cp.execSync('npm install --info --prefix ' + path.join(context.opts.projectRoot, 'plugins') + ' shelljs');
};
