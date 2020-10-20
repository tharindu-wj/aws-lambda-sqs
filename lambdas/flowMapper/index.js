// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-2" });

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

/**
 *
 * @param {*} event
 * sample event
 * {
 *  body: {
 *        lambdaName: '',
 *        payload: {}
 *      }
 * }
 * @param {*} context
 */
exports.handler = async function (event, context) {
  console.log("FlowMapper Lambda tiggered");
  const params = {
    // Remove DelaySeconds parameter and value for FIFO queues
    DelaySeconds: 0,
    MessageAttributes: {},
    MessageBody: JSON.stringify({...event.body, currentTime: new Date().toLocaleString()}),
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/317127958808/flow-queue",
  };

  const response = await sqs.sendMessage(params).promise();
  console.log(`SQS Response: ${JSON.stringify(response)}`);
  console.log("FlowMapper Lambda completed");
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
