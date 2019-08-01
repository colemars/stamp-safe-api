import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { buyerReport, sellerReport } from "./constants/definitions";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      typeId: buyerReport,
      accessKey: event.pathParameters.id
    },
    UpdateExpression:
      "SET backgroundCheckStatus = :backgroundCheckStatus, stolenPropertyCheckStatus = :stolenPropertyCheckStatus, priceAlertStatus = :priceAlertStatus",
    ExpressionAttributeValues: {
      ":backgroundCheckStatus": data.backgroundCheckStatus || "Not Started",
      ":stolenPropertyCheckStatus":
        data.stolenPropertyCheckStatus || "Not Started",
      ":priceAlertStatus": data.priceAlertStatus || "Not Started"
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
