exports.handler = async function (event, context) {
  console.log("Async flow triggered");

  console.log(JSON.stringify(event));

  console.log("Async flow completed");

  return {
    statusCode: 200,
    body: JSON.stringify({ name: "asyncFLow Lambda" }),
  };
};
