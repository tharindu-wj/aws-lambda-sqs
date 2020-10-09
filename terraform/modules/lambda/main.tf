resource "aws_lambda_function" "lambda" {
  filename      = var.filename
  function_name = var.function_name
  role          = var.iam_role_arn
  handler       = "exports.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256(var.filename)

  runtime = var.runtime

  environment {
    variables = var.environment_vars
  }
}
