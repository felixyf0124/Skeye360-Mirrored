const { REACT_APP_API_URL } = process.env;
export interface Response {
  count_type: string;
  count_direction: string;
  count: number;
  time: any;
  intersection_id: number;
}

const APIDomain = REACT_APP_API_URL;

//const url = `//${APIDomain}/api/count/?time=&timestamp__lte=${next_day}T00%3A00%3A00Z&timestamp__gte={$current_day}T00%3A00%3A00Z`;
//const url = `//${APIDomain}/api/count/?intersection_id=${intersection_id}&time=&timestamp__lte=${dateTomorrowLastYear}T00%3A00%3A00Z&timestamp__gte=${dateLastYear}T00%3A00%3A00Z`;

export const getCountMA = async (intersection_id: string, dateLastYear: string, dateTomorrowLastYear: string): Promise<Response> => {
  const url = `//${APIDomain}/api/count/?intersection_id=${intersection_id}&count_type=arima`;
  const settings = {
    method: 'GET',
    headers: {},
  };
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
}