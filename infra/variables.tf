variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
  default     = "gleider-dev"
}

variable "domain" {
  description = "Root domain name (e.g., gleider.dev)"
  type        = string
}

variable "region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "us-east-2"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "gleiderdev"
}

variable "db_username" {
  description = "Master username for the RDS instance"
  type        = string
  default     = "gleider"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance (e.g., your IP)"
  type        = string
  default     = "0.0.0.0/0"
}
