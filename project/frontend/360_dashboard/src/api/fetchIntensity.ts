export interface Response {
  los: number;
}

const fetchIntensity = async (cameraIP: string): Promise<Response> => {
  const url = `//${cameraIP}/los/`;
  const response = await fetch(url);
  const data = (await response.json()) as Response;
  return data;
};

export default fetchIntensity;
