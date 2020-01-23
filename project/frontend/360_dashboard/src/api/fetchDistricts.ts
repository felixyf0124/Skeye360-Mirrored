const { REACT_APP_API_URL } = process.env;

export interface Response {
  [district: string]: {
    id: number;
    district_name: string;
    intersections: {
      id: number;
      intersection_name: string;
      latitude: number;
      cameras: [];
      longitude: number;
      district_id: number;
    }[];
  }[];
}

const APIDomain = REACT_APP_API_URL;

const fetchDistricts = async (): Promise<Response> => {
  const url = `//${APIDomain}/api/district/`;
  const response = await fetch(url);
  const data = (await response.json()) as Response;
  return data;
};

export default fetchDistricts;
