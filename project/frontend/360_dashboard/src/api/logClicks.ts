export interface Response {
  log_message: string;
  user_id: number;  
}

const APIDomain = '127.0.0.1:8000';

const logClicks = async (
  log_message: string,
  user_id: number,
): Promise<Response> => {
  const url = `//${APIDomain}/api/userlog/`;
  const params = {
    log_message,
    user_id, 
  };
  const settings = {
    method: 'POST',
    body: new URLSearchParams(JSON.stringify(params)),
    headers: {'Content-Type': 'application/json'},
  }

  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export default logClicks;