output "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "nameservers" {
  description = "Route53 hosted zone nameservers"
  value       = aws_route53_zone.main.name_servers
}

output "certificate_arn" {
  description = "ARN of the validated ACM certificate"
  value       = aws_acm_certificate.wildcard.arn
}
