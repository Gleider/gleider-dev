output "ec2_public_ip" {
  description = "Elastic IP of the EC2 instance"
  value       = aws_eip.main.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = "ec2-${replace(aws_eip.main.public_ip, ".", "-")}.${var.region}.compute.amazonaws.com"
}

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.main.id
}

output "ecr_web_repository_url" {
  description = "URL of the ECR repository for the web image"
  value       = aws_ecr_repository.web.repository_url
}

output "ecr_api_repository_url" {
  description = "URL of the ECR repository for the API image"
  value       = aws_ecr_repository.api.repository_url
}

output "ssh_private_key" {
  description = "SSH private key (save to file and chmod 600)"
  value       = tls_private_key.ec2.private_key_pem
  sensitive   = true
}

output "ecr_letreco_web_repository_url" {
  description = "URL of the ECR repository for the Letreco web image"
  value       = aws_ecr_repository.letreco_web.repository_url
}

output "ecr_letreco_api_repository_url" {
  description = "URL of the ECR repository for the Letreco API image"
  value       = aws_ecr_repository.letreco_api.repository_url
}
