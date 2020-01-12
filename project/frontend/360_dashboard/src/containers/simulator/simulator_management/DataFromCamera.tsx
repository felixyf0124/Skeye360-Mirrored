/**
 * @class DataFromCamera
 */
export default class DataFromCamera {
  static async getDataFromCamera(): Promise<string> {
    try {
      const response = await fetch('http://127.0.0.1:8001/coord/');
      // console.log("TEXT:" + await response.text());
      return await response.text();
    } catch (e) {
      console.log(`ERROR in DataFromCamera:${e}`);
      return `ERROR:${e}`;
    }
  }

  static async getNumberOfCars(rawResponse: string): Promise<number> {
    // Since at every set of data it ends with ),
    // then counting the number of ) will result in the number of cars on the camera feed
    return rawResponse.split(')').length - 1;
  }
}
