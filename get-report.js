import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const buyerReportParams = {
    TableName: "reports",
    Key: {
      reportId: event.pathParameters.id
    }
  };
  const sellerReportParams = {
    TableName: "stages",
    Key: {
      stageId: event.pathParameters.id
    }
  };

  try {
    const buyerReport = await dynamoDbLib.call("get", buyerReportParams);
    if (buyerReport.Item) {
      // Return the retrieved item
      return success(buyerReport.Item);
    }
    const sellerReport = await dynamoDbLib.call("get", sellerReportParams);
    if (sellerReport.Item) {
      // Return the retrieved item
      return success(sellerReport.Item);
    }
    return failure({ status: false, error: "Item not found." });
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}
