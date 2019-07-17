import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  const stagesParams = {
    TableName: "stages",
    Key: {
      stageId: data.stageId
    },
  };

  try {
    const result = await dynamoDbLib.call("get", stagesParams);
    if (result.Item) {
      const reportsParams = {
        TableName: "reports",
        Item: {
          reportId: uuid.v4(),
          stageId: data.stageId,
          serialNumber: result.Item.serialNumber,
          make: result.Item.make,
          model: result.Item.model,
          yearManufactored: result.Item.yearManufactored,
          conditionOfItem: result.Item.conditionOfItem,
          image: result.Item.image,
          previousOwners: result.Item.previousOwners,
          price: result.Item.price,
          backgroundCheckStatus: null,
          stolenPropertyCheckStatus: null,
          priceAlertStatus: null,
          createdAt: Date.now()
        }
      }
      const updateStageParams = {
        TableName: "stages",
        Key: {
          stageId: data.stageId
        },
        UpdateExpression: "SET linkedReportIds = list_append(linkedReportIds, :linkedReportIds)",
        ExpressionAttributeValues: {
          ":linkedReportIds": [reportsParams.Item.reportId.toString()],
        },
      }
      await dynamoDbLib.call("put", reportsParams);
      await dynamoDbLib.call("update", updateStageParams);
      return success(reportsParams.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
