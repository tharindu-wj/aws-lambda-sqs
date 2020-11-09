# aws-lambda-sqs

create `terraform/provider.tf` and add aws credentials
`
provider "aws" {
  region     = "us-east-2"
  access_key = ""
  secret_key = ""
}
`

Run `npm run deploy` for deploy to AWS