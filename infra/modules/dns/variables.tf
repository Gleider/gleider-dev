variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
}

variable "domain" {
  description = "Root domain name"
  type        = string
}

variable "cloudfront_distribution" {
  description = "CloudFront distribution domain name"
  type        = string
}

variable "cloudfront_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  type        = string
}

variable "ec2_public_ip" {
  description = "Public Elastic IP of the EC2 instance"
  type        = string
}
