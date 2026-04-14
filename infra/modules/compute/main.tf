data "aws_caller_identity" "current" {}

# -----------------------------------------------------------------------------
# SSH Key Pair
# -----------------------------------------------------------------------------
resource "tls_private_key" "ec2" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ec2" {
  key_name   = "${var.project_name}-key"
  public_key = tls_private_key.ec2.public_key_openssh

  tags = {
    Name = "${var.project_name}-key"
  }
}

# -----------------------------------------------------------------------------
# ECR Repositories
# -----------------------------------------------------------------------------
resource "aws_ecr_repository" "web" {
  name                 = "${var.project_name}-web"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-web"
  }
}

resource "aws_ecr_repository" "api" {
  name                 = "${var.project_name}-api"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-api"
  }
}

# -----------------------------------------------------------------------------
# IAM Role for EC2 (ECR access + SSM)
# -----------------------------------------------------------------------------
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2" {
  name               = "${var.project_name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = {
    Name = "${var.project_name}-ec2-role"
  }
}

data "aws_iam_policy_document" "ec2_permissions" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchCheckLayerAvailability",
    ]
    resources = ["*"]
  }

  statement {
    actions = [
      "ssm:GetParameters",
      "ssm:GetParameter",
    ]
    resources = [var.db_password_ssm_arn]
  }

  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ec2" {
  name   = "${var.project_name}-ec2-policy"
  role   = aws_iam_role.ec2.id
  policy = data.aws_iam_policy_document.ec2_permissions.json
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2.name

  tags = {
    Name = "${var.project_name}-ec2-profile"
  }
}

# -----------------------------------------------------------------------------
# EC2 Instance (Amazon Linux 2023, t3.micro free tier)
# -----------------------------------------------------------------------------
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "main" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.ec2.key_name
  vpc_security_group_ids = [var.ec2_security_group_id]
  subnet_id              = var.public_subnet_id
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    region         = var.region
    account_id     = data.aws_caller_identity.current.account_id
    project_name   = var.project_name
    ecr_web_url    = aws_ecr_repository.web.repository_url
    ecr_api_url    = aws_ecr_repository.api.repository_url
    db_endpoint    = var.db_endpoint
    db_name        = var.db_name
    db_username    = var.db_username
    db_password_ssm = "/${var.project_name}/database/password"
    domain         = var.domain
  }))

  tags = {
    Name = "${var.project_name}-server"
  }
}

# -----------------------------------------------------------------------------
# Elastic IP
# -----------------------------------------------------------------------------
resource "aws_eip" "main" {
  instance = aws_instance.main.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-eip"
  }
}
