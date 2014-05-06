#!/usr/bin/env node
/*global ls, target, find, echo, cat, exit, exec, mkdir, test */

"use strict";

require("shelljs/make");

var OPTIONS = JSON.parse(cat("./jshint.json"));

function createExec(filename, contents) {

  var fullPathToFile = "./bin/" + filename;
  contents.join("\n").to(fullPathToFile);
  exec("chmod +x " + fullPathToFile);

  echo("node - " + filename);
}

target.lint = function () {
  var jshint = require("jshint").JSHINT;
  var files = find("formats")
    .filter(function (file) {
      return file.match(/\.js$/);
    });

  echo("Linting files...", "\n");

  var failures = {};
  files.forEach(function (file) {
    var passed = jshint(cat(file), OPTIONS);
    process.stdout.write(passed ? "." : "F");

    if (!passed) {
      failures[file] = jshint.data();
    }
  });

  echo("\n");

  if (Object.keys(failures).length === 0) {
    echo("All files passed.");
    return;
  }

  var outputError = function (err) {
    if (!err) {
      return;
    }

    var line = "[L" + err.line + "]";
    while (line.length < 10) {
      line += " ";
    }

    echo(line, err.reason);
    echo("\n");
  };

  for (var key in failures) {
    echo(key);
    failures[key].errors.forEach(outputError);
  }

  exit(1);
};

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