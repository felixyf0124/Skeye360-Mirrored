export interface Response {
  los: number;
}

// Getting the count information from backend
export const getCount = async (cameraUrl: string): Promise<Response> => {
  // Eurl endpoint with id??
  const url = `//${cameraUrl}/los/`;
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

export default getCount;
