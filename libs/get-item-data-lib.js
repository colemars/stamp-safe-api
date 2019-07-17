import * as dynamoDbLib from "./dynamodb-lib";
import { success, failure } from "./response-lib";

export default async function main(event, context) {
  const params = {
    TableName: "stages",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      stageId: "0c05b55b-f3ee-466f-9732-789ddbd8e9e3"
    },
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}

// var apigClientFactory = require("aws-api-gateway-client").default;
// var AWS = require("aws-sdk");

// export default function getData(reportId) {
//   getCredentials(reportId, makeRequest)
// }

// function getCredentials(reportId, callback) {
//   AWS.config.update({ region: "us-west-2" });

//   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: "us-west-2:026e8fdb-0a86-4bed-9356-552147dde0b0",
//   });

//   AWS.config.credentials.get(function (err) {
//     if (err) {
//       console.log(err.message ? err.message : err);
//       return;
//     }
//     callback(reportId);
//   });
// }

// function makeRequest(reportId) {

//   var apigClient = apigClientFactory.newClient({
//     accessKey: AWS.config.credentials.accessKeyId,
//     secretKey: AWS.config.credentials.secretAccessKey,
//     sessionToken: AWS.config.credentials.sessionToken,
//     // replace below with a config file
//     region: "us-west-2",
//     invokeUrl: "https://vm2imvvr6j.execute-api.us-west-2.amazonaws.com/prod"
//   });

//   var pathParams = {
//     reportId: reportId
//   };
//   //replace below with optional params
//   var additionalParams = {};
//   var body = {};

//   apigClient
//     .invokeApi(pathParams, '/stage/{reportId}', 'GET', additionalParams, body)
//     .then(function (result) {
//       console.dir({
//         status: result.status,
//         statusText: result.statusText,
//         data: result.data
//       });
//       return result.data
//     })
//     .catch(function (result) {
//       if (result.response) {
//         console.dir({
//           status: result.response.status,
//           statusText: result.response.statusText,
//           data: result.response.data
//         });
//       } else {
//         console.log(result.message);
//       }
//     });
// }