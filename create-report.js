import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { buyerReport, sellerReport } from "./constants/definitions";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const newLinkKey = uuid.v4();
  const newAccessToken = uuid.v4();
  const reportType = data.typeId === sellerReport ? sellerReport : buyerReport;
  const newAccessKey = reportType === sellerReport ? data.accessKey : uuid.v4();
  const returnValues =
    reportType === sellerReport
      ? { accessKey: newAccessKey, linkKey: newLinkKey }
      : { newAccessToken };
  const conditionalAttributes = {};

  if (reportType === sellerReport) conditionalAttributes.linkedReports = [];
  if (reportType === buyerReport) {
    conditionalAttributes.stolenPropertyCheckStatus = "Not Started";
    conditionalAttributes.priceAlertStatus = "Not Started";
    conditionalAttributes.accessToken = newAccessToken;
    conditionalAttributes.reportStatus = "Not Started";
  }

  const params = {
    TableName: process.env.tableName,
    Item: {
      typeId: reportType,
      accessKey: newAccessKey,
      linkKey: newLinkKey,
      serialNumber: data.serialNumber,
      make: data.make,
      model: data.model,
      yearManufactored: data.yearManufactored,
      conditionOfItem: data.conditionOfItem,
      imageKeys: data.imageKeys,
      previousOwners: data.previousOwners,
      price: data.price,
      backgroundCheckStatus: "Not Started",
      linkedReport: data.linkedReport,
      accessToken: conditionalAttributes.accessToken,
      stolenPropertyCheckStatus:
        conditionalAttributes.stolenPropertyCheckStatus,
      priceAlertStatus: conditionalAttributes.priceAlertStatus,
      linkedReports: conditionalAttributes.linkedReports,
      reportStatus: conditionalAttributes.reportStatus,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    if (reportType === buyerReport) {
      const updateSellerReportParams = {
        TableName: process.env.tableName,
        Key: {
          typeId: sellerReport,
          accessKey: data.accessKey
        },
        UpdateExpression:
          "SET linkedReports = list_append(linkedReports, :linkedReports)",
        ExpressionAttributeValues: {
          ":linkedReports": [newLinkKey]
        }
      };
      await dynamoDbLib.call("update", updateSellerReportParams);
    }
    return success(returnValues);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
