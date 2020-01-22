const { REACT_APP_API_URL } = process.env;
export interface Response {
  count_type: string;
  count_direction: string;
  count: number;
  time: any;
  intersection_id: number;
}

const APIDomain = REACT_APP_API_URL;

//TEST:
//Return all count responses with count_type as moving average
export const getCountMA = async (): Promise<Response> => {
    const url = `//${APIDomain}/api/count/?count_type=MoAvg`;
    const settings = {
        method: 'GET',
        headers: {},
    };
    const response = await fetch(url, settings);
    const data = (await response.json()) as Response; 
    console.log(data);
    console.log('test frm data')
    return data;
}