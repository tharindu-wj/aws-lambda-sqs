resource "aws_dynamodb_table" "applications-table" {
  name           = "Applications"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 1
  hash_key       = "applicationId"
  range_key      = "createdAt"

  attribute {
    name = "applicationId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  tags = {
    Name        = "applications-table"
    Environment = "production"
  }
}
