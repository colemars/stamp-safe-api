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

  const getLinkedReport = async reportKey => {
    console.log("begin func");
    const paramsQuery = {
      TableName: process.env.tableName,
      IndexName: "typeId-linkKey-index",
      KeyConditionExpression: "typeId = :id and linkKey = :key",
      ExpressionAttributeValues: {
        ":id": buyerReport,
        ":key": reportKey
      }
    };
    try {
      const results = await dynamoDbLib.call("query", paramsQuery);
      console.log(results);
      const { reportStatus } = results.Items[0];
      console.log(reportStatus);
      return reportStatus;
    } catch (e) {
      return failure({ status: false });
    }
  };

  try {
    const buyerResults = await dynamoDbLib.call("get", buyerReportParams);

    if (buyerResults.Item) {
      return success(buyerResults.Item);
    }

    const sellerResults = await dynamoDbLib.call("get", sellerReportParams);

    if (sellerResults.Item) {
      console.log("seller report", sellerResults.Item);
      const reportStatuses = [];
      console.log("linked reports", sellerResults.Item.linkedReports);
      // eslint-disable-next-line no-restricted-syntax
      for (const linkedReport of sellerResults.Item.linkedReports) {
        console.log("begin loop", linkedReport);
        // eslint-disable-next-line no-await-in-loop
        const reportStatus = await getLinkedReport(linkedReport);
        reportStatuses.push(reportStatus);
        console.log("end loop", reportStatus);
        console.log("new array", reportStatuses);
      }
      return success({ item: sellerResults.Item, statuses: reportStatuses });
    }
    return failure({ status: false, error: "Item not found." });
  } catch (e) {
    return failure({ status: false });
  }
}
