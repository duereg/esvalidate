[![Build Status](https://travis-ci.org/duereg/esvalidate.png)](https://travis-ci.org/duereg/esvalidate)
[![Dependencies](https://david-dm.org/duereg/esvalidate.png)](https://david-dm.org/duereg/esvalidate)
[![devDependencies](https://david-dm.org/duereg/esvalidate/dev-status.png)](https://david-dm.org/duereg/esvalidate#info=devDependencies&view=table)

# ESValidate

A command line interface and npm package for ESValidate - a JavaScript validator using Esprima.

## Install

To use esvalidate from any location (for npm v1.x) you need to install using the global (-g) flag.

    npm install -g esvalidate

## Usage

    esvalidate -h

You can also require ESValidate itself as a module.

    var esvalidate = require('esvalidate');

Note: If you are using npm v1.x be sure to install esvalidate locally (without the -g flag) or link it globally.

## Text Editor Plugins

* [sublime-esvalidate](https://github.com/duereg/sublime-jsvalidate) - `CTRL-SHIFT-V` on any .js file.

## Custom Reporters

Specify a custom formatter module (see formats/junit.js).

    --formatter path/to/format.js
