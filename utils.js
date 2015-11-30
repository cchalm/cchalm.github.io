"use strict";

function hasKey(dict, key) {
  return Object.prototype.hasOwnProperty.call(dict, key);  
}

function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    throw new Error(message);
  }
}
