/* eslint-disable @typescript-eslint/camelcase */
export interface Response {
  log_message: string;
  user_id: number;
}

const APIDomain = '40.121.23.48:8000';

const logClicks = async (
  log_message: string,
  user_id: number,
): Promise<Response> => {
  const url = `//${APIDomain}/api/userlog/`;
  const body = {
    log_message,
    user_id,
  };
  const bodyString = JSON.stringify(body);

  const settings = {
    method: 'POST',
    body: bodyString,
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export default logClicks;
