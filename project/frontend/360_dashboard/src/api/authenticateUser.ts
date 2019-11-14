export interface Response {
  username: string;
  user_id: number;
}

const APIDomain = '40.121.23.48:8000';

const authenticateUser = async (
  username: string,
  password: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/auth/login`;
  const params = {
    username,
    password,
  };
  console.log(params);

  const settings = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'content-type': 'application/json' },
  };

  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export default authenticateUser;
