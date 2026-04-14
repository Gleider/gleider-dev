variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "public_subnet_id" {
  description = "Public subnet ID for the EC2 instance"
  type        = string
}

variable "ec2_security_group_id" {
  description = "Security group ID for the EC2 instance"
  type        = string
}

variable "db_endpoint" {
  description = "RDS instance endpoint (host:port)"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password_ssm_arn" {
  description = "ARN of the SSM parameter storing the DB password"
  type        = string
}

variable "domain" {
  description = "Root domain name"
  type        = string
}
