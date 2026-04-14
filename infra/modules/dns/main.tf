# -----------------------------------------------------------------------------
# Route53 Hosted Zone
# -----------------------------------------------------------------------------
resource "aws_route53_zone" "main" {
  name = var.domain

  tags = {
    Name = "${var.project_name}-zone"
  }
}

# -----------------------------------------------------------------------------
# ACM Wildcard Certificate (must be in us-east-1 for CloudFront)
# -----------------------------------------------------------------------------
resource "aws_acm_certificate" "wildcard" {
  domain_name               = var.domain
  subject_alternative_names = ["*.${var.domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.project_name}-wildcard-cert"
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.wildcard.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "wildcard" {
  certificate_arn         = aws_acm_certificate.wildcard.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# -----------------------------------------------------------------------------
# DNS Records
# -----------------------------------------------------------------------------

# Apex domain -> CloudFront
resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# www -> CloudFront
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain}"
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# api -> CloudFront
resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.${var.domain}"
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# Wildcard CNAME for future subdomains (e.g., letreco.gleider.dev)
resource "aws_route53_record" "wildcard" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "*.${var.domain}"
  type    = "CNAME"
  ttl     = 300
  records = [var.domain]
}
