import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "reports",
    Key: {
      reportId: event.pathParameters.id
    },
    UpdateExpression: "SET backgroundCheckStatus = :backgroundCheckStatus, stolenPropertyCheckStatus = :stolenPropertyCheckStatus, priceAlertStatus = :priceAlertStatus",
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
    console.log(e)
    return failure({ status: false });
  }
}