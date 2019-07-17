import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "stages",
    // 'Item' contains the attributes of the item to be created
    // - 'reportId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      stageId: uuid.v4(),
      accessToken: uuid.v4(),
      serialNumber: data.serialNumber,
      make: data.make,
      model: data.model,
      yearManufactored: data.yearManufactored,
      conditionOfItem: data.conditionOfItem,
      image: data.image,
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
    console.log(e);
    return failure({ status: false });
  }
}
