import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      typeId: data.typeId,
      accessKey: data.accessKey
    },
    UpdateExpression:
      "SET backgroundCheckStatus = :backgroundCheckStatus, stolenPropertyCheckStatus = :stolenPropertyCheckStatus, priceAlertStatus = :priceAlertStatus",
    ExpressionAttributeValues: {
      ":backgroundCheckStatus": data.backgroundCheckStatus || null,
      ":stolenPropertyCheckStatus": data.stolenPropertyCheckStatus || null,
      ":priceAlertStatus": data.priceAlertStatus || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
