"use strict";

var _highlight = _interopRequireDefault(require("highlight.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env worker */
onmessage = function onmessage(event) {
  var _event$data = event.data,
      code = _event$data.code,
      languages = _event$data.languages;
  var result;

  if (languages && languages.length === 1) {
    result = _highlight.default.highlight(languages[0], code, true);
  } else {
    result = _highlight.default.highlightAuto(code, languages);
  }

  postMessage(result);
};