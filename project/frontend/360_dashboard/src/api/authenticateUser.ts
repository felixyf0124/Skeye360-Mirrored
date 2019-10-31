export interface Response {
  username: string;
  token: string;
  timestamp: string;
}

const APIDomain = '0.0.0.0:8000';

const authenticateUser = async (
  username: string,
  password: string
): Promise<Response> => {
  const url = `//${APIDomain}/api/user/` + username + `/` + password + `/`;
  // const params = {
  //   username,
  //   password,
  // };
  
  const response = await fetch(url);
  const data = (await response.json()) as Response;
  return data;
};

export default authenticateUser;
