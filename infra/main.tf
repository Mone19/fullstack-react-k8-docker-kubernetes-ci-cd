provider "aws" {
  region = "eu-central-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.51.1"
    }
  }
  backend "s3" {
    bucket         = "aiq-tfstate"
    key            = "terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "aiq-terraform-lock-table"
    encrypt        = true
  }
}


resource "aws_s3_bucket" "aiq" {
  bucket = "aiq-frontend"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "example" {
  bucket = aws_s3_bucket.aiq.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.aiq.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "example" {
  depends_on = [
    aws_s3_bucket_ownership_controls.example,
    aws_s3_bucket_public_access_block.example,
  ]

  bucket = aws_s3_bucket.aiq.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "web-config" {
  bucket = aws_s3_bucket.aiq.id

  index_document {
    suffix = "index.html"
  }
}


# resource "aws_cloudfront_distribution" "website_distribution" {
#   origin {
#     domain_name = aws_s3_bucket.aiq.bucket_regional_domain_name
#     origin_id   = "S3Origin"
#   }

#   enabled             = true
#   default_root_object = "index.html"
#   default_cache_behavior {
#     allowed_methods  = ["GET", "HEAD", "OPTIONS"]
#     cached_methods   = ["GET", "HEAD", "OPTIONS"]
#     target_origin_id = "S3Origin"

#     viewer_protocol_policy = "redirect-to-https"
#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }
#   }

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     cloudfront_default_certificate = true
#   }
# }

# output "website_url" {
#   description = "URL meiner Website"
#   value       = aws_cloudfront_distribution.website_distribution.domain_name
# }
