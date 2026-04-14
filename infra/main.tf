module "networking" {
  source = "./modules/networking"

  project_name     = var.project_name
  region           = var.region
  ssh_allowed_cidr = var.ssh_allowed_cidr
}

module "database" {
  source = "./modules/database"

  project_name       = var.project_name
  db_name            = var.db_name
  db_username        = var.db_username
  private_subnet_ids = module.networking.private_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id
}

module "compute" {
  source = "./modules/compute"

  project_name        = var.project_name
  region              = var.region
  environment         = var.environment
  public_subnet_id    = module.networking.public_subnet_ids[0]
  ec2_security_group_id = module.networking.ec2_security_group_id
  db_endpoint         = module.database.rds_endpoint
  db_name             = var.db_name
  db_username         = var.db_username
  db_password_ssm_arn = module.database.db_password_ssm_arn
  domain              = var.domain
}

module "cdn" {
  source = "./modules/cdn"

  project_name    = var.project_name
  domain          = var.domain
  certificate_arn = module.dns.certificate_arn
  origin_domain_name = module.compute.ec2_public_dns
}

module "dns" {
  source = "./modules/dns"

  providers = {
    aws = aws.us_east_1
  }

  project_name              = var.project_name
  domain                    = var.domain
  cloudfront_distribution   = module.cdn.cloudfront_distribution_domain
  cloudfront_hosted_zone_id = module.cdn.cloudfront_hosted_zone_id
  ec2_public_ip             = module.compute.ec2_public_ip
}
