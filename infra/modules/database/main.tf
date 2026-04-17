# -----------------------------------------------------------------------------
# Auto-generated password
# -----------------------------------------------------------------------------
resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_ssm_parameter" "db_password" {
  name        = "/${var.project_name}/database/password"
  description = "RDS master password for ${var.project_name}"
  type        = "SecureString"
  value       = random_password.db.result

  tags = {
    Name = "${var.project_name}-db-password"
  }
}

# -----------------------------------------------------------------------------
# DB Subnet Group
# -----------------------------------------------------------------------------
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# -----------------------------------------------------------------------------
# RDS PostgreSQL Instance
# -----------------------------------------------------------------------------
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"

  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 50
  storage_type          = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]

  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project_name}-db-final-snapshot"
  publicly_accessible = false

  backup_retention_period = 1
  multi_az                = false

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "${var.project_name}-db"
  }
}
