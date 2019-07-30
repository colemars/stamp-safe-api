import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const newLinkKey = uuid.v4();
  const newAccessToken = uuid.v4();
  const sellerReport = "100";
  const buyerReport = "101";
  const reportType = data.typeId === sellerReport ? sellerReport : buyerReport;
  const newAccessKey = reportType === sellerReport ? data.accessKey : uuid.v4();
  const returnValues =
    reportType === sellerReport
      ? { accessKey: newAccessKey, linkKey: newLinkKey }
      : { newAccessToken };
  const conditionalAttributes = {};

  if (reportType === sellerReport) conditionalAttributes.linkedReports = [];
  if (reportType === buyerReport) {
    conditionalAttributes.stolenPropertyCheckStatus = false;
    conditionalAttributes.priceAlertStatus = false;
    conditionalAttributes.accessToken = newAccessToken;
  }

  const params = {
    TableName: "stampsafe-reports",
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
      backgroundCheckStatus: false,
      linkedReport: data.linkedReport,
      accessToken: conditionalAttributes.accessToken,
      stolenPropertyCheckStatus:
        conditionalAttributes.stolenPropertyCheckStatus,
      priceAlertStatus: conditionalAttributes.priceAlertStatus,
      linkedReports: conditionalAttributes.linkedReports,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    if (reportType === buyerReport) {
      const updateSellerReportParams = {
        TableName: "stampsafe-reports",
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
