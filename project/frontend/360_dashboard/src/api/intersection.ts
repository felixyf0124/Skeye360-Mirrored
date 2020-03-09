const { REACT_APP_API_URL } = process.env;

/* eslint-disable @typescript-eslint/camelcase */
export interface Response {
  id: number;
  intersection_name: string;
  latitude: number;
  cameras: [];
  longitude: number;
  district_id: number;
}

const APIDomain = REACT_APP_API_URL;

// CREATE
export const addIntersection = async (
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
  user_id: string,
): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/intersection/`;
  const params = {
    intersection_name,
    latitude,
    longitude,
    district_id,
    user_id,
  };
  const settings = {
    method: 'POST',
    body: new URLSearchParams(params),
    headers: {},
  };

  // POST REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  const data = (await response.json()) as Response;
  return data;
};

// READ
export const getIntersection = async (id: string): Promise<Response> => {
  // ENDPOINT
  const url = `//${APIDomain}/api/intersection/${id}/`;

  const settings = {
    method: 'GET',
    headers: {},
  };
  // GET REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  const data = (await response.json()) as Response;
  return data;
};

// UPDATE
export const editIntersection = async (
  intersection_id: string,
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/intersection/${intersection_id}/`;
  const params = {
    intersection_name,
    latitude,
    longitude,
    district_id,
  };
  const settings = {
    method: 'PUT',
    body: new URLSearchParams(params),
    headers: {},
  };

  // PUT REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  const data = (await response.json()) as Response;
  return data;
};

// DELETE
export const deleteIntersection = async (id: string): Promise<any> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/intersection/${id}/`;
  const settings = {
    method: 'DELETE',
    headers: {},
  };

  // DELETE REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  return response;
};
