const { REACT_APP_API_URL } = process.env;

/* eslint-disable @typescript-eslint/camelcase */
export interface Response {
  log_message: string;
  user_id: number;
}

const APIDomain = REACT_APP_API_URL;

const logClicks = async (log_message: string, user_id: number): Promise<Response> => {
  // ENDPOINT, PARAMS
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

  // POST REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  const data = (await response.json()) as Response;
  return data;
};

export default logClicks;
