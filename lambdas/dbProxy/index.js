const { DateTime } = require("luxon");
const { v4: uuidv4 } = require("uuid");
// Load the AWS SDK for Node.js
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// Set the region
AWS.config.update({ region: "us-east-2" });

// Create an DynmoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "Applications";

/**
 *
 * @param {*} event
 * @param {*} context
 */
exports.handler = async function (event, context) {
  console.log("DBProxy Lambda tiggered");
  console.log(event);

  await create(event.item);

  const response = {};
  console.log(`DynmoDB Response: ${JSON.stringify(response)}`);
  console.log("DBProxy Lambda completed");
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

const create = (data) => {
  const createdAt = DateTime.local().setZone("Asia/Kolkata").toString();
  const item = {data};
  item._id = uuidv4();
  item.createdAt = createdAt;

  return dynamodb
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();
};

const getById = (id, data) => {};
const update = (id, data) => {};
const remove = (id) => {};
