// Load the AWS SDK for Node.js
var AWSXRay = require("aws-xray-sdk-core");
const AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-2" });
const lambda = AWSXRay.captureAWSClient(new AWS.Lambda());

/**
 *
 * @param {*} event
 * Records: [
 *  {
 *    body: {
 *      lambdaName: '',
 *      payload: {}
 *    }
 *  }
 * ]
 * @param {*} context
 */
exports.handler = async function (event, context) {
  console.log("Async flow triggered");
  console.log(JSON.stringify(event));
  const { tracingId } = event;
  console.log("Trace id", tracingId);

  const params = {
    FunctionName: "dbProxy",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      tracingId,
      action: "getById",
      item: {
        applicationId: "9676aa8c-8afa-4dd4-a813-9ce51c7465ab",
      },
    }),
  };

  const response = await lambda.invoke(params).promise();

  console.log(response);
  console.log("Async flow completed");
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
