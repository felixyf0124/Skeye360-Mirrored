export interface Response {
  username: string;
  log_message: string;
}

const APIDomain = '0.0.0.0:8000';

const logClicks = async (
  username: string,
  timestamp: string, 
  log_message: string,
): Promise<Response> => {
  const url = `//${APIDomain}/api/userlogs/`;
  const params = {
    username,
    log_message,
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
