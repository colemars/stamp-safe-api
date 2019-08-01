import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { buyerReport } from "./constants/definitions";

export default async function main(event) {
  const params = {
    TableName: process.env.tableName,
    IndexName: "typeId-accessToken-index",
    KeyConditionExpression: "typeId = :id and accessToken = :token",
    ExpressionAttributeValues: {
      ":id": buyerReport,
      ":token": event.pathParameters.id
    },
    Select: "ALL_PROJECTED_ATTRIBUTES"
  };
  try {
    const report = await dynamoDbLib.call("query", params);
    if (report.Items) {
      const { accessKey } = report.Items[0];
      const updateParams = {
        TableName: process.env.tableName,
        Key: {
          typeId: buyerReport,
          accessKey
        },
        UpdateExpression:
          "SET accessToken = :accessToken, reportStatus = :reportStatus",
        ExpressionAttributeValues: {
          ":accessToken": "expired",
          ":reportStatus": "In Progress"
        },
        ReturnValues: "ALL_NEW"
      };
      await dynamoDbLib.call("update", updateParams);
      return success(report.Items[0]);
    }
    console.log("not found")
    return failure({ status: false, error: "Item not found." });
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}
