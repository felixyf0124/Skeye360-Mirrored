/* eslint-disable @typescript-eslint/camelcase */
const { REACT_APP_API_URL } = process.env;
export interface Response {
    username: string;
    password: string;
    email: string;
    is_staff: any;
  }

const APIDomain = REACT_APP_API_URL;

// CREATE
export const registerUser = async (
  username: string,
  password: string,
  email: string,
  is_staff: any,
): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/auth/register`;
  const params = {
    username,
    password,
    email,
    is_staff,
  };
  const settings = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'content-type': 'application/json' },
  };
  // POST REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  const data = (await response.json()) as Response;
  return data;
};

export default registerUser;
