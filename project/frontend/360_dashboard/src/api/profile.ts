/* eslint-disable @typescript-eslint/camelcase */
const { REACT_APP_API_URL } = process.env;
export interface Response {
    id: string;
    username: string;
    password: string;
    email: string;
    is_staff: boolean;
  }

const APIDomain = REACT_APP_API_URL;

// READ
export const getProfile = async (
  id: string,
): Promise<Response> => {
// ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/user/${id}/`;

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

export default getProfile;
