const { REACT_APP_API_URL } = process.env;

export interface Response {
  username: string;
  user_id: number;
  is_staff: boolean;
}

const APIDomain = REACT_APP_API_URL;

const authenticateUser = async (username: string, password: string): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/auth/login`;
  const params = {
    username,
    password,
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

export default authenticateUser;
