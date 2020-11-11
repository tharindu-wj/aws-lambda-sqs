// Load the AWS SDK for Node.js
var AWSXRay = require('aws-xray-sdk-core');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'us-east-2' });
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
  console.log('SQS Poller Triggered');
  console.log(JSON.stringify(event));
  const records = event.Records;

  const recordPromises = records.map((record) => {
    const body = JSON.parse(record.body);
    const traceHeader = record.attributes.AWSTraceHeader.split(';');
    const trace_id = traceHeader[0].split('=')[1];
    const parent_id = traceHeader[1].split('=')[1];
    const sampled = traceHeader[2].split('=')[1];
    console.log({ traceHeader });

    const segment = AWSXRay.getSegment();
    segment.trace_id = trace_id;
    segment.parent_id = parent_id;
    // console.dir({segment1: segment}, {depth:null})

    //segment.init('sqsTriggerCustom', trace_id, parent_id)

    console.log({ segment2: JSON.stringify(segment) });

    const { lambdaName, tracingId, ...otherPayload } = body;
    const params = {
      FunctionName: lambdaName,
      InvocationType: 'Event',
      Payload: JSON.stringify({ ...otherPayload, tracingId }),
    };
    console.log('Trace id', tracingId);
    return lambda.invoke(params).promise();
  });

  const response = await Promise.all(recordPromises);

  console.log(JSON.stringify(response));
  console.log('SQS Poller Completed');
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
