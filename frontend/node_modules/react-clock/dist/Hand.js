"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Hand;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("./shared/propTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Hand(_ref) {
  var angle = _ref.angle,
      name = _ref.name,
      length = _ref.length,
      oppositeLength = _ref.oppositeLength,
      width = _ref.width;
  return _react["default"].createElement("div", {
    className: "react-clock__hand react-clock__".concat(name, "-hand"),
    style: {
      transform: "rotate(".concat(angle, "deg)")
    }
  }, _react["default"].createElement("div", {
    className: "react-clock__hand__body react-clock__".concat(name, "-hand__body"),
    style: {
      width: "".concat(width, "px"),
      top: "".concat(50 - length / 2, "%"),
      bottom: "".concat(50 - oppositeLength / 2, "%")
    }
  }));
}

Hand.defaultProps = {
  angle: 0,
  length: 100,
  oppositeLength: 10,
  width: 1
};
Hand.propTypes = {
  angle: _propTypes["default"].number,
  length: _propTypes2.isHandLength,
  name: _propTypes["default"].string.isRequired,
  oppositeLength: _propTypes2.isHandLength,
  width: _propTypes["default"].number
};