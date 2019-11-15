export interface Response {
  username: string;
  user_id: number;
}

const APIDomain = '40.121.23.48:8000';

const authenticateUser = async (
  username: string,
  password: string,
): Promise<Response> => {
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
