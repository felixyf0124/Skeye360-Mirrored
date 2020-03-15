const { REACT_APP_API_URL } = process.env;

export interface Response {
  count: number;
  time: string;
}

const APIDomain = REACT_APP_API_URL;

// Fetch Count Endpoint call
// Params:
// count_type: arima, ma(moving average)
// count_direction(16): ns, sn, ew, we, wn, nw, en, ne, ws, sw, es, se, nn, ss, ww, ee
// n = north
// s = south
// w = west
// e = east
// intersection_id: number
// date: yyyy-mm-dd
// timestamp__lte, timestamp__gte format: 2020-01-01T00:00:00Z
export const fetchCount = async (
  count_type: string,
  count_direction: string,
  date: string,
): Promise<Response[]> => {
  const url = `//${APIDomain}/api/count/?count_type=${count_type}&count_direction=${count_direction}&timestamp__gte=${date}T00:00:00Z&timestamp__lte=${date}T23:59:59Z`;
  // GET REQUEST
  // console.log(url);
  const response = await fetch(url);

  // DATA RESPONSE
  const data: Response[] = (await response.json()) as Response[];

  return data;
};
