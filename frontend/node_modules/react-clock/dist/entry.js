"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Clock", {
  enumerable: true,
  get: function get() {
    return _Clock["default"];
  }
});
exports["default"] = void 0;

var _Clock = _interopRequireDefault(require("./Clock"));

require("./Clock.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// File is created during build phase and placed in dist directory
// eslint-disable-next-line import/no-unresolved
var _default = _Clock["default"];
exports["default"] = _default;