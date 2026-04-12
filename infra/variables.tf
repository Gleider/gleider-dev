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
  default     = "us-east-1"
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

variable "api_image_tag" {
  description = "Docker image tag for the API container"
  type        = string
  default     = "latest"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
