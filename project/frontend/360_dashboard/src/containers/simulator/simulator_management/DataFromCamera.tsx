/**
 * @class DataFromCamera
 */
export default class DataFromCamera {
  async getDataFromCamera() {
    try {
      const response = await fetch('http://40.76.30.181:8000/coord/');
      // console.log("TEXT:" + await response.text());
      return await response.text();
    } catch (e) {
      console.log(`ERROR:${e}`);
    }
  }

  async getNumberOfCars(rawResponse: string) {
    // Since at every set of data it ends with ), then counting the number of ) will result in the number of cars on the camera feed
    return rawResponse.split(')').length - 1;
  }
}
