resource "aws_sqs_queue" "flow_deadletter_queue" {
  name                      = "flow-deadletter-queue"
  delay_seconds             = 0
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  #redrive_policy = jsonencode({
  #  deadLetterTargetArn = aws_sqs_queue.terraform_queue_deadletter.arn
  #  maxReceiveCount     = 4
  #})

  tags = {
    Environment = "dev"
  }
}

resource "aws_sqs_queue" "flow_queue" {
  name                       = "flow-queue"
  delay_seconds              = 0
  max_message_size           = 2048
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 20
  visibility_timeout_seconds = 10

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.flow_deadletter_queue.arn
    maxReceiveCount     = 4
  })

  tags = {
    Environment = "dev"
  }
}
