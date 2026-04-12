output "vpc_id" {
  description = "ID of the VPC"
  value       = module.networking.vpc_id
}

output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = module.cdn.cloudfront_distribution_domain
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.ecs.alb_dns_name
}

output "ecr_repository_url" {
  description = "URL of the ECR repository for the API image"
  value       = module.ecs.ecr_repository_url
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for static assets"
  value       = module.cdn.s3_bucket_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.database.rds_endpoint
}

output "nameservers" {
  description = "Route53 hosted zone nameservers"
  value       = module.dns.nameservers
}

output "website_url" {
  description = "Main website URL"
  value       = "https://${var.domain}"
}

output "api_url" {
  description = "API URL"
  value       = "https://api.${var.domain}"
}
