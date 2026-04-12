module "networking" {
  source = "./modules/networking"

  project_name = var.project_name
  region       = var.region
}

module "database" {
  source = "./modules/database"

  project_name       = var.project_name
  db_name            = var.db_name
  db_username        = var.db_username
  private_subnet_ids = module.networking.private_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id
}

module "ecs" {
  source = "./modules/ecs"

  project_name          = var.project_name
  region                = var.region
  environment           = var.environment
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  private_subnet_ids    = module.networking.private_subnet_ids
  ecs_security_group_id = module.networking.ecs_security_group_id
  alb_security_group_id = module.networking.alb_security_group_id
  api_image_tag         = var.api_image_tag
  db_endpoint           = module.database.rds_endpoint
  db_name               = var.db_name
  db_username           = var.db_username
  db_password_ssm_arn   = module.database.db_password_ssm_arn
}

module "dns" {
  source = "./modules/dns"

  providers = {
    aws = aws.us_east_1
  }

  project_name                = var.project_name
  domain                      = var.domain
  cloudfront_distribution     = module.cdn.cloudfront_distribution_domain
  cloudfront_hosted_zone_id   = module.cdn.cloudfront_hosted_zone_id
  alb_dns_name                = module.ecs.alb_dns_name
  alb_zone_id                 = module.ecs.alb_zone_id
}

module "cdn" {
  source = "./modules/cdn"

  project_name    = var.project_name
  domain          = var.domain
  certificate_arn = module.dns.certificate_arn
}
