/* eslint-disable @typescript-eslint/camelcase */
export interface Response {
  id: number;
  intersection_name: string;
  latitude: number;
  cameras: [];
  longitude: number;
  district_id: number;
}

const APIDomain = '0.0.0.0:8000';

export const addIntersection = async (
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/intersection/`;
  const params = {
    intersection_name,
    latitude,
    longitude,
    district_id,
  };
  const settings = {
    method: 'POST',
    body: new URLSearchParams(params),
    headers: {},
  };
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export const getIntersection = async (
  id: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/intersection/${id}`;
  const settings = {
    method: 'GET',
    headers: {},
  };
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export const editIntersection = async (
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/intersection/`;
  const params = {
    intersection_name,
    latitude,
    longitude,
    district_id,
  };
  const settings = {
    method: 'POST',
    body: new URLSearchParams(params),
    headers: {},
  };
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export const deleteIntersection = async (
  id: string,
): Promise<any> => {
  const url = `//${APIDomain}/api/intersection/${id}`;
  const settings = {
    method: 'DELETE',
    headers: {},
  };
  const response = await fetch(url, settings);
  console.log(`DELETED ${id}`);
  console.log(response);
  const data = (await response.json()) as Response;
  console.log(data);
  return data;
};
