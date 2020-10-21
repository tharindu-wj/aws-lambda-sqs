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
  console.log("SQS Poller Triggered");
  console.log(JSON.stringify(event));
  const records = event.Records;

  const recordPromises = records.map((record) => {
    const body = JSON.parse(record.body);
    const { lambdaName, ...otherPayload } = body;
    const params = {
      FunctionName: body.lambdaName,
      InvocationType: "Event",
      Payload: JSON.stringify(otherPayload),
    };

    return lambda.invoke(params).promise();
  });

  const response = await Promise.all(recordPromises);

  console.log(JSON.stringify(response));
  console.log("SQS Poller Completed");
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
