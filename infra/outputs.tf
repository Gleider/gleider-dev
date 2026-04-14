output "vpc_id" {
  description = "ID of the VPC"
  value       = module.networking.vpc_id
}

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = module.compute.ec2_public_ip
}

output "ecr_web_repository_url" {
  description = "URL of the ECR repository for the web image"
  value       = module.compute.ecr_web_repository_url
}

output "ecr_api_repository_url" {
  description = "URL of the ECR repository for the API image"
  value       = module.compute.ecr_api_repository_url
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.database.rds_endpoint
}

output "nameservers" {
  description = "Route53 hosted zone nameservers — set these in Hostinger"
  value       = module.dns.nameservers
}

output "ssh_private_key" {
  description = "SSH private key to connect to the EC2 instance"
  value       = module.compute.ssh_private_key
  sensitive   = true
}

output "ssh_command" {
  description = "Command to SSH into the EC2 instance"
  value       = "ssh -i gleider-dev-key.pem ec2-user@${module.compute.ec2_public_ip}"
}

output "website_url" {
  description = "Main website URL"
  value       = "https://${var.domain}"
}

output "api_url" {
  description = "API URL"
  value       = "https://api.${var.domain}"
}
