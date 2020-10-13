resource "aws_iam_role_policy" "iam_policy_sqsTrigger" {
  name = "iam_policy_sqsTrigger"
  role = aws_iam_role.iam_for_sqsTrigger.id

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
      "Sid": "Stmt1602260999597",
      "Action": [
       "sqs:DeleteMessage",
        "sqs:DeleteMessageBatch",
        "sqs:GetQueueAttributes",
        "sqs:GetQueueUrl",
        "sqs:ReceiveMessage"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
    ]
  }
  EOF
}

resource "aws_iam_role" "iam_for_sqsTrigger" {
  name = "iam_for_sqsTrigger"

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


resource "aws_lambda_function" "sqsTrigger" {
  filename      = "../lambdas/sqsTrigger/sqsTrigger.zip"
  function_name = "sqsTrigger"
  role  = aws_iam_role.iam_for_sqsTrigger.arn
  handler       = "index.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../lambdas/sqsTrigger/sqsTrigger.zip")

  runtime = "nodejs12.x"
}

# resource "aws_lambda_event_source_mapping" "sqsTrigger_sqs_mapping" {
#   event_source_arn = "arn:aws:sqs:us-east-2:317127958808:flow-queue"
#   function_name    = aws_lambda_function.sqsTrigger.arn
# }
