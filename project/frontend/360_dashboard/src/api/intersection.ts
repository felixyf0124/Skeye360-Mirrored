/* eslint-disable @typescript-eslint/camelcase */
export interface Response {
  id: number;
  intersection_name: string;
  latitude: number;
  cameras: [];
  longitude: number;
  district_id: number;
}

const APIDomain = '40.121.23.48:8000';

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
  const url = `//${APIDomain}/api/intersection/${id}/`;
  const settings = {
    method: 'GET',
    headers: {},
  };
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export const editIntersection = async (
  intersection_id: string,
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): Promise<Response> => {
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
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export const deleteIntersection = async (
  id: string,
): Promise<any> => {
  const url = `//${APIDomain}/api/intersection/${id}/`;
  const settings = {
    method: 'DELETE',
    headers: {},
  };
  const response = await fetch(url, settings);
  return response;
};
