variable "filename" {
  type = string
}

variable "function_name" {
  type = string
}

variable "iam_role_arn" {
  type = string
}

variable "runtime" {
  type    = string
  default = "nodejs12.x"
}

variable "environment_vars" {
  type    = map(any)
  default = {}
}
