export interface Response {
  intersection_id: number;
  los: number;
}

const APIDomain = '0.0.0.0:8000';

// Getting the count information from backend
export const getCount = async (): Promise<Response> => {

  // Eurl endpoint with id??
  const url = `//${APIDomain}/los/`;
  const settings = {
    method: 'GET',
    headers: {},
  };

  // post request
  const response = await fetch(url, settings);

  // data response
  const data = (await response.json()) as Response;

  return data;
};