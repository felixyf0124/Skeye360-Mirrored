/* eslint-disable import/no-unresolved */
const createDOM = require('./createDOM');

process.browser = true;

createDOM();
require('./init');
