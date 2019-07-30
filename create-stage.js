import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "stages",
    Item: {
      stageId: data.accessToken,
      serialNumber: data.serialNumber,
      make: data.make,
      model: data.model,
      yearManufactored: data.yearManufactored,
      conditionOfItem: data.conditionOfItem,
      imageKeys: data.imageKeys,
      previousOwners: data.previousOwners,
      price: data.price,
      backgroundCheckStatus: null,
      linkedReportIds: [],
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
