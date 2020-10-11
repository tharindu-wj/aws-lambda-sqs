// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-2" });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

var queueURL = "https://sqs.us-east-2.amazonaws.com/317127958808/flow-queue";

var params = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

exports.handler = async function (event, context) {
  const messages = await sqs.receiveMessage(params).promise();
  console.log(JSON.stringify(messages));

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
