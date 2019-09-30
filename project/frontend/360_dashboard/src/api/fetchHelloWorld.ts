export interface HelloResponse {
  hello: string;
}

const fetchHelloWorld = async (
  APIDomain = '172.17.0.3:8000',
): Promise<HelloResponse> => {
  console.log("fetchHelloWorld");
  const url = `//${APIDomain}/hello/odm`;
  const response = await fetch(url, {
  });
  const resp = (await response.json()) as HelloResponse;
  return resp;
};

export default fetchHelloWorld;
