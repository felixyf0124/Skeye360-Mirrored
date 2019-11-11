//https://stackoverflow.com/questions/36855370/angular-2-how-to-set-double-float-int-boolean-type-params-in-get-post-req
//Encoding number to string
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
  const body = {
    "log_message": log_message,
    "user_id": user_id
  }
  const bodyString=JSON.stringify(body);

  const settings = {
    method: 'POST',
    body: bodyString,
    headers: {'Content-Type': 'application/json'},
  }

  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

export default logClicks;