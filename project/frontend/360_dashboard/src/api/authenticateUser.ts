export interface Response {
  username: string;
  user_id: number;
}

const APIDomain = '127.0.0.1:8000';

const authenticateUser = async (
  username: string,
  password: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/auth/login`;
  const body = {
    "username": username,
    "user_id": user_id
  }

  const bodyString=JSON.stringify(body);

  const settings = {
    method: 'POST',
    body: bodyString,
    headers: {'Content-Type': 'application/json'},
  }

  const response = await fetch(url);
  const data = (await response.json()) as Response;
  return data;
};

export default authenticateUser;
