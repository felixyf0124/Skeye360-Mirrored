export default function splitIntoTwo(values: any) {
  // console.log(values);
  const data1x = [];
  const data1y = [];
  let i;
  let j;
  /* eslint-disable no-plusplus */
  /* eslint-disable radix */
  for (i = 0; i < values.length; i++) {
    data1x.push(parseInt(values[i].time.substring(11, 13)));
  }
  for (j = 0; j < values.length; j++) {
    data1y.push(parseInt(values[j].count));
  }
  // use hash later
  /* eslint-disable max-len */
  return [[data1x[0], data1y[0]], [data1x[1], data1y[1]], [data1x[2], data1y[2]], [data1x[3], data1y[3]], [data1x[4], data1y[4]],
    [data1x[5], data1y[5]], [data1x[6], data1y[6]], [data1x[7], data1y[7]], [data1x[8], data1y[8]], [data1x[9], data1y[9]],
    [data1x[10], data1y[10]], [data1x[11], data1y[11]], [data1x[12], data1y[12]], [data1x[13], data1y[13]], [data1x[14], data1y[14]],
    [data1x[15], data1y[15]], [data1x[16], data1y[16]], [data1x[17], data1y[17]], [data1x[18], data1y[18]], [data1x[19], data1y[19]],
    [data1x[20], data1y[20]], [data1x[21], data1y[21]], [data1x[22], data1y[22]], [data1x[23], data1y[23]]];
}
