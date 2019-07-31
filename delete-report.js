/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { buyerReport, sellerReport } from "./constants/definitions";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const reportType = data.typeId === sellerReport ? sellerReport : buyerReport;
  const paramsOriginal = {
    TableName: "stampsafe-reports",
    Key: {
      typeId: data.typeId,
      accessKey: event.pathParameters.id
    }
  };

  const deleteLinkedReport = async reportKey => {
    const paramsQuery = {
      TableName: "stampsafe-reports",
      IndexName: "typeId-linkKey-index",
      KeyConditionExpression: "typeId = :id and linkKey = :key",
      ExpressionAttributeValues: {
        ":id": buyerReport,
        ":key": reportKey
      }
    };
    try {
      const results = await dynamoDbLib.call("query", paramsQuery);
      const key = results.Items[0].accessKey;
      const paramsDelete = {
        TableName: "stampsafe-reports",
        Key: {
          typeId: buyerReport,
          accessKey: key
        }
      };
      await dynamoDbLib.call("delete", paramsDelete);
      return success({ status: true });
    } catch (e) {
      return failure({ status: false });
    }
  };

  if (reportType === sellerReport) {
    const results = await dynamoDbLib.call("get", paramsOriginal);
    for (const linkedReport of results.Item.linkedReports) {
      await deleteLinkedReport(linkedReport);
    }
  }

  try {
    await dynamoDbLib.call("delete", paramsOriginal);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
