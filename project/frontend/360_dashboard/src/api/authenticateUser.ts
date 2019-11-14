export interface Response {
  username: string;
  token: string;
  timestamp: string;
  user_id: number;
}

const APIDomain = '40.121.23.48:8000';

const authenticateUser = async (
  username: string,
  password: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/user/${username}/${password}/`;
  // const params = {
  //   username,
  //   password,
  // };

  const response = await fetch(url);
  const data = (await response.json()) as Response;
  return data;
};

export default authenticateUser;
