/*global print:true */

var log;

//shims console & print to generic 'log' method
if ((log === undefined) && (typeof console !== 'undefined') && (typeof console.log === 'function')) {
  log = console.log;
}

if ((log === undefined) && (typeof print === 'function')) {
  log = print;
}

if (log === undefined) {
  throw "Cannot find system to write output to.";
}