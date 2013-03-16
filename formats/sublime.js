var formatter;

(function () {
  'use strict';
  var removeLineNumRegEx = /^Line\ [0-9]*\:\ /;

  function padString(amountToPad) {
    var paddingCounter = 8 - amountToPad,
        padding = '',
        i;

    for (i = 0; i < paddingCounter; i++) {
      padding += ' ';
    }

    return padding;
  }

  formatter = function (log) {
    return {
      startLog: function () { },
      startSection: function (fileName, errors, failures) {
        log("[esvalidate file:" + fileName + "]");
        errors = errors + failures;

        if (errors > 0) {
          log(errors + " Error" + (errors > 1 ? "s" : "") + ":");
        }
      },
      writeError: function (fileName, error) {
        var msg = error.message;
        msg = msg.replace(removeLineNumRegEx, '');
        if (error.lineNumber && error.column) {
          var padding = padString((error.lineNumber.toString() + error.column.toString()).length);
          log(padding, error.lineNumber + ',' + error.column + ':', msg);
        } else {
          log(msg);
        }
      },
      endSection: function () { },
      endLog: function () { }
    };
  };

  if (typeof module !== 'undefined') {
    module.exports = formatter;
  }
}());