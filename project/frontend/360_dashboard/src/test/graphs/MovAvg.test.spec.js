import splitIntoTwo from '../../components/graphFunction';

const { assert } = require('chai');

describe('Key-pair values', () => {
  it('object into 2d array', () => {
    const x = [
      {
        count_direction: 'ns',
        time: '2020-01-26T00:00:00Z',
        count: 48,
        count_type: 'ma'
      },
      {
        count_direction: 'ns',
        count: 45,
        time: '2020-01-26T12:00:00Z',
        count_type: 'ma'
      },
      {
        count_direction: 'ns',
        count: 56,
        time: '2020-01-26T16:00:00Z',
        count_type: 'ma'
      }
    ];
    const splitted = splitIntoTwo(x);
    const expected = [[0,48], [12, 45], [16, 56]];
    assert.deepEqual(splitted[0][0],expected[0][0]);
    assert.deepEqual(splitted[0][1],expected[0][1]);
    assert.deepEqual(splitted[1][0],expected[1][0]);
  })
})