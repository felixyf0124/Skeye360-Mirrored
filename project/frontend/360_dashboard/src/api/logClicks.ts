export interface Response {
  log_message: string;
  username: string;
}

const APIDomain = '127.0.0.1:8000';

const logClicks = async (
  log_message: string,
  username: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/userlog`;
  const params = {
    log_message,
    username,
  };
  const settings = {
    method: 'POST',
    body: new URLSearchParams(params),
    headers: {},
  }

  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export default logClicks;