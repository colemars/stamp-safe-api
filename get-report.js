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
      const { reportStatus, linkKey } = results.Items[0];
      return { status: reportStatus, key: linkKey };
    } catch (e) {
      console.log(e)
      return failure({ e });
    }
  };

  try {
    const buyerResults = await dynamoDbLib.call("get", buyerReportParams);

    if (buyerResults.Item) {
      return success(buyerResults.Item);
    }

    const sellerResults = await dynamoDbLib.call("get", sellerReportParams);

    if (sellerResults.Item) {
      const reportStatuses = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const linkedReport of sellerResults.Item.linkedReports) {
        // eslint-disable-next-line no-await-in-loop
        const reportStatus = await getLinkedReport(linkedReport);
        reportStatuses.push(reportStatus);
      }
      return success({ item: sellerResults.Item, statuses: reportStatuses });
    }
    return failure({ status: false, error: "Item not found." });
  } catch (e) {
    return failure({ status: false });
  }
}
