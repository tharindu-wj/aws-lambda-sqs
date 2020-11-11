const { DateTime } = require("luxon");
// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
var AWSXRay = require("aws-xray-sdk-core");

// Set the region
AWS.config.update({ region: "us-east-2" });

// Create an SQS service object
const sqs = AWSXRay.captureAWSClient(new AWS.SQS({ apiVersion: "2012-11-05" }));

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
  console.log(event);
  const triggeredTime = DateTime.local().setZone("Asia/Kolkata").toString();
  const tracingId = event.headers["X-Amzn-Trace-Id"];
  console.log("Trace id", tracingId);

  const params = {
    // Remove DelaySeconds parameter and value for FIFO queues
    DelaySeconds: 0,
    MessageAttributes: {},
    MessageBody: JSON.stringify({
      headers: {
      },
      body: {
        ...JSON.parse(event.body),
        triggeredTime,
        tracingId,
      },
    }),
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/317127958808/flow-queue",
    // MessageSystemAttributes: {
    //   AWSTraceHeader: {
    //     DataType: "String",
    //     StringValue: tracingId,
    //   },
    // },
  };

  const response = await sqs.sendMessage(params).promise();
  console.log(`SQS Response: ${JSON.stringify(response)}`);
  console.log("FlowMapper Lambda completed");
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
