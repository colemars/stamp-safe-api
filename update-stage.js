import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "stages",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      stageId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET serialNumber = :serialNumber, make = :make, model = :model, yearManufactored = :yearManufactored, conditionOfItem = :conditionOfItem, image = :image, previousOwners = :previousOwners, price = :price",
    ExpressionAttributeValues: {
      ":serialNumber": data.serialNumber || null,
      ":make": data.make || null,
      ":model": data.model || null,
      ":yearManufactored": data.yearManufactored || null,
      ":conditionOfItem": data.conditionOfItem || null,
      ":image": data.image || null,
      ":previousOwners": data.previousOwners || null,
      ":price": data.price || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}
