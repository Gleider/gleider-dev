output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  value       = aws_cloudfront_distribution.main.hosted_zone_id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for static assets"
  value       = aws_s3_bucket.frontend.id
}
