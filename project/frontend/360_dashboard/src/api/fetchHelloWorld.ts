export interface HelloResponse {
  hello: string;
}

const fetchHelloWorld = async (
  APIDomain = '0.0.0.0:8000',
): Promise<HelloResponse> => {
  console.log("fetchHelloWorld");
  const url = `//${APIDomain}/hello/hello-view`;
  const response = await fetch(url, { mode: 'no-cors'
  });
  const resp = (await response.json()) as HelloResponse;
  return resp;
};

export default fetchHelloWorld;
