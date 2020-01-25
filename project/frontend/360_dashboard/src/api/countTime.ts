const { REACT_APP_API_URL } = process.env;
export interface Response {
  count_type: string;
  count_direction: string;
  count: number;
  time: any;
  intersection_id: number;
}

const APIDomain = REACT_APP_API_URL;

export const getCountMA = async (intersection_id: string): Promise<Response> => {
    const url = `//${APIDomain}/api/count/?intersection_id=${intersection_id}&count_type=arima`;
    const settings = {
        method: 'GET',
        headers: {},
    };
    const response = await fetch(url, settings);
    const data = (await response.json()) as Response;
    return data;
}