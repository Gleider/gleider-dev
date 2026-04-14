variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
}

variable "domain" {
  description = "Root domain name"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate for the domain"
  type        = string
}

variable "origin_domain_name" {
  description = "Public DNS name of the EC2 origin"
  type        = string
}
