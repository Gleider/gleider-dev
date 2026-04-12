output "rds_endpoint" {
  description = "RDS instance endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
}

output "rds_address" {
  description = "RDS instance hostname"
  value       = aws_db_instance.main.address
}

output "db_password_ssm_arn" {
  description = "ARN of the SSM parameter storing the DB password"
  value       = aws_ssm_parameter.db_password.arn
}
