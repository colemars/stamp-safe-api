import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { buyerReport, sellerReport } from "./constants/definitions";

export default async function main(event) {
  const buyerReportParams = {
    TableName: process.env.tableName,
    Key: {
      typeId: buyerReport,
      accessKey: event.pathParameters.id
    }
  };
  const sellerReportParams = {
    TableName: process.env.tableName,
    Key: {
      typeId: sellerReport,
      accessKey: event.pathParameters.id
    }
  };

  try {
    const buyerResults = await dynamoDbLib.call("get", buyerReportParams);
    if (buyerResults.Item) {
      return success(buyerResults.Item);
    }
    const sellerResults = await dynamoDbLib.call("get", sellerReportParams);
    if (sellerResults.Item) {
      return success(sellerResults.Item);
    }
    return failure({ status: false, error: "Item not found." });
  } catch (e) {
    return failure({ status: false });
  }
}
