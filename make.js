#!/usr/bin/env node
/*global ls, target, find, echo, cat, exit, exec, mkdir, test */

"use strict";

require("shelljs/make");

function createExec(filename, contents) {

  var fullPathToFile = "./bin/" + filename;
  contents.join("\n").to(fullPathToFile);
  exec("chmod +x " + fullPathToFile);

  echo("node - " + filename);
}

target.build = function () {
  if (exec('npm install').code !== 0) {
    echo('Error: npm install failed');
    exit(1);
  }

  var browserify = require("browserify");
  var bundle = browserify({ debug: true });

  bundle.addEntry("./node_modules/esprima/esprima.js");

  if (!test("-e", "./bin")) {
    mkdir("./bin");
  }

  echo("Building into bin/...", "\n");

  bundle.append("esprima = require('/esprima.js');");

  var log = cat("./src/log.js");
  var esprima = [ "var esprima;",
    bundle.bundle()
  ].join("\n");

  var esvalidate = [log, esprima, cat("./esvalidate.js")].join("\n"); 
  var node = cat("./src/environs/node.js");

  createExec("esvalidate", [node, esvalidate]);

  var rhino = cat("./src/environs/rhino.js");
  
  createExec("rhino-esvalidate", [rhino, esvalidate]);

  var phantom = cat("./src/environs/phantom.js");
  
  createExec("phantom-esvalidate", [phantom, esvalidate]);
};