const { REACT_APP_API_URL } = process.env;

/* eslint-disable @typescript-eslint/camelcase */
export interface Response {
  id: number;
  camera_url: string;
  intersection_id: number;
}

const APIDomain = REACT_APP_API_URL;

// CREATE
export const addCamera = async (camera_url: string, intersection_id: string): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/camera/`;
  const params = {
    camera_url,
    intersection_id,
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
export const getCamera = async (id: string): Promise<Response> => {
  // ENDPOINT
  const url = `//${APIDomain}/api/camera/${id}/`;

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
export const editCamera = async (
  id: string,
  camera_url: string,
  intersection_id: string,
): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/camera/${intersection_id}/`;
  const params = {
    id,
    camera_url,
    intersection_id,
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
export const deleteCamera = async (id: string): Promise<any> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/camera/${id}/`;
  const settings = {
    method: 'DELETE',
    headers: {},
  };

  // DELETE REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  return response;
};
