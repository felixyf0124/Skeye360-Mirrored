export interface authResponse {
  session_token: string;
  name: string;
  email: string;
}

const authenticateUser = async (
  APIDomain = '0.0.0.0:8000',
  email: string,
  password: string
): Promise<authResponse> => {
  const url = `//${APIDomain}/api/v1/account/authenticate`;
  const params = {
    username: email,
    password,
  };
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams(params),
  });
  const resp = (await response.json()) as authResponse;
  return resp;
};

export default authenticateUser;
