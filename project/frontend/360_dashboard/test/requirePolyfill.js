/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

require.extensions['.png'] = () => '';
