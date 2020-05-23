"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHours = getHours;
exports.getMinutes = getMinutes;
exports.getSeconds = getSeconds;
var hourOptionalSecondsRegExp = /^(([0-1])?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/;
var hourRegExp = /^(([0-1])?[0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9])$/;

function getHours(date) {
  if (date instanceof Date) {
    return date.getHours();
  }

  if (typeof date === 'string' && hourOptionalSecondsRegExp.test(date)) {
    var hourString = date.split(':')[0];
    return parseInt(hourString, 10);
  }

  throw new Error("Failed to get hours from date: ".concat(date, "."));
}

function getMinutes(date) {
  if (date instanceof Date) {
    return date.getMinutes();
  }

  if (typeof date === 'string' && hourOptionalSecondsRegExp.test(date)) {
    var minuteString = date.split(':')[1];
    return parseInt(minuteString, 10);
  }

  throw new Error("Failed to get minutes from date: ".concat(date, "."));
}

function getSeconds(date) {
  if (date instanceof Date) {
    return date.getSeconds();
  }

  if (typeof date === 'string') {
    if (hourRegExp.test(date)) {
      var secondString = date.split(':')[2];
      return parseInt(secondString, 10);
    }

    if (hourOptionalSecondsRegExp.test(date)) {
      return 0;
    }
  }

  throw new Error("Failed to get seconds from date: ".concat(date, "."));
}