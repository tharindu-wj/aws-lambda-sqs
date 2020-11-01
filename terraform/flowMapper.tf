resource "aws_iam_role_policy" "iam_policy_flowMapper" {
  name = "iam_policy_flowMapper"
  role = aws_iam_role.iam_for_flowMapper.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
          "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
      "Sid": "Stmt1602258244504",
      "Action": [
        "sqs:SendMessage",
        "sqs:SendMessageBatch"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
            "Effect": "Allow",
            "Action": [
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords",
                "xray:GetSamplingRules",
                "xray:GetSamplingTargets",
                "xray:GetSamplingStatisticSummaries"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
  }
  EOF
}

resource "aws_iam_role" "iam_for_flowMapper" {
  name = "iam_for_flowMapper"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_lambda_function" "flowMapper" {
  filename      = "../lambdas/flowMapper/flowMapper.zip"
  function_name = "flowMapper"
  role          = aws_iam_role.iam_for_flowMapper.arn
  handler       = "index.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../lambdas/flowMapper/flowMapper.zip")

  runtime = "nodejs12.x"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      foo = "bar"
    }
  }
}

resource "aws_api_gateway_resource" "test" {
  rest_api_id = aws_api_gateway_rest_api.test.id
  parent_id   = aws_api_gateway_rest_api.test.root_resource_id
  path_part   = "flow-mapper"
}

resource "aws_api_gateway_method" "test" {
  rest_api_id   = aws_api_gateway_rest_api.test.id
  resource_id   = aws_api_gateway_resource.test.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "test" {
  rest_api_id = aws_api_gateway_rest_api.test.id
  resource_id = aws_api_gateway_resource.test.id
  http_method = aws_api_gateway_method.test.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.flowMapper.invoke_arn
}

resource "aws_lambda_permission" "apigw" {
   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.flowMapper.function_name
   principal     = "apigateway.amazonaws.com"

   # The "/*/*" portion grants access from any method on any resource
   # within the API Gateway REST API.
   source_arn = "${aws_api_gateway_rest_api.test.execution_arn}/*/*"
}

# resource "aws_api_gateway_resource" "proxy" {
#    rest_api_id = aws_api_gateway_rest_api.orch_test.id
#    parent_id   = aws_api_gateway_rest_api.orch_test.root_resource_id
#    path_part   = "{proxy+}"
# }

# resource "aws_api_gateway_method" "proxy" {
#    rest_api_id   = aws_api_gateway_rest_api.orch_test.id
#    resource_id   = aws_api_gateway_resource.proxy.id
#    http_method   = "ANY"
#    authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "lambda" {
#    rest_api_id = aws_api_gateway_rest_api.orch_test.id
#    resource_id = aws_api_gateway_method.proxy.resource_id
#    http_method = aws_api_gateway_method.proxy.http_method

#    integration_http_method = "POST"
#    type                    = "AWS_PROXY"
#    uri                     = aws_lambda_function.flowMapper.invoke_arn
# }

# resource "aws_api_gateway_method" "proxy_root" {
#    rest_api_id   = aws_api_gateway_rest_api.orch_test.id
#    resource_id   = aws_api_gateway_rest_api.orch_test.root_resource_id
#    http_method   = "ANY"
#    authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "lambda_root" {
#    rest_api_id = aws_api_gateway_rest_api.orch_test.id
#    resource_id = aws_api_gateway_method.proxy_root.resource_id
#    http_method = aws_api_gateway_method.proxy_root.http_method

#    integration_http_method = "POST"
#    type                    = "AWS_PROXY"
#    uri                     = aws_lambda_function.flowMapper.invoke_arn
# }

# resource "aws_api_gateway_deployment" "example" {
#    depends_on = [
#      aws_api_gateway_integration.lambda,
#      aws_api_gateway_integration.lambda_root,
#    ]

#    rest_api_id = aws_api_gateway_rest_api.orch_test.id
#    stage_name  = "test"
# }

# resource "aws_lambda_permission" "apigw" {
#    statement_id  = "AllowAPIGatewayInvoke"
#    action        = "lambda:InvokeFunction"
#    function_name = aws_lambda_function.flowMapper.function_name
#    principal     = "apigateway.amazonaws.com"

#    # The "/*/*" portion grants access from any method on any resource
#    # within the API Gateway REST API.
#    source_arn = "${aws_api_gateway_rest_api.orch_test.execution_arn}/*/*"
# }


