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

variable "alb_dns_name" {
  description = "DNS name of the ALB"
  type        = string
}

variable "alb_zone_id" {
  description = "Hosted zone ID of the ALB"
  type        = string
}
