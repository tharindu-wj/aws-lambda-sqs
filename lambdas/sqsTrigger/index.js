// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-2" });
const lambda = new AWS.Lambda();

/**
 *
 * @param {*} event
 * {
 *        lambdaName: '',
 *        payload: {}
 *      }
 * @param {*} context
 */
exports.handler = async function (originalEvent, context) {
  console.log("SQS Poller Triggered");
  console.log(JSON.stringify(originalEvent));
  const event = JSON.parse(originalEvent);

  var params = {
    FunctionName: event.lambdaName,
    InvocationType: "Event",
    Payload: JSON.stringify(payload),
  };

  const response = await lambda.invoke(params).promise();
  console.log(JSON.stringify(response));
  console.log("SQS Poller Completed");
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
