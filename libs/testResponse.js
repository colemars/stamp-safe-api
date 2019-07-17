var apigClientFactory = require("aws-api-gateway-client").default;
var AWS = require("aws-sdk");
var reportId = "0c05b55b-f3ee-466f-9732-789ddbd8e9e3"

function getCredentials(reportId, callback) {
  AWS.config.update({ region: "us-west-2" });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-west-2:026e8fdb-0a86-4bed-9356-552147dde0b0",
  });

  AWS.config.credentials.get(function (err) {
    if (err) {
      console.log(err.message ? err.message : err);
      return;
    }
    console.log(AWS.config.credentials)
    callback(reportId);
  });
}

function makeRequest(reportId) {

  var apigClient = apigClientFactory.newClient({
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    // replace below with a config file
    region: "us-west-2",
    invokeUrl: "https://vm2imvvr6j.execute-api.us-west-2.amazonaws.com/prod"
  });

  var pathParams = {
    reportId: reportId
  };
  //replace below with optional params
  var additionalParams = {};
  var body = {};

  apigClient
    .invokeApi(pathParams, '/stage/{reportId}', 'GET', additionalParams, body)
    .then(function (result) {
      console.dir({
        status: result.status,
        statusText: result.statusText,
        data: result.data
      });
      console.log(JSON.stringify(result.data, null, 3));
    })
    .catch(function (result) {
      if (result.response) {
        console.dir({
          status: result.response.status,
          statusText: result.response.statusText,
          data: result.response.data
        });
      } else {
        console.log(result.message);
      }
    });
}

getCredentials(reportId, makeRequest)