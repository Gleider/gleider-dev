variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance"
  type        = string
}
