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

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for the ALB"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "alb_security_group_id" {
  description = "Security group ID for the ALB"
  type        = string
}

variable "api_image_tag" {
  description = "Docker image tag for the API container"
  type        = string
}

variable "db_endpoint" {
  description = "RDS instance endpoint"
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
