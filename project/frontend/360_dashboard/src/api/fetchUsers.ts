const { REACT_APP_API_URL } = process.env;

export interface Response {
  [users: string]: {
    id: number;
    username: string;
    is_staff: boolean;
  }[];
}

const APIDomain = REACT_APP_API_URL;

export const fetchOperators = async (): Promise<[Response]> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/api/user/?is_staff=false`;

  const settings = {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  };

  // GET REQUEST
  const response = await fetch(url, settings);

  // DATA RESPONSE
  const data = (await response.json()) as Response;
  return [data];
};
