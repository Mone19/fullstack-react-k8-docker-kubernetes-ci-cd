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
    key            = "1/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "aiq-terraform-lock-table"
    encrypt        = true
  }
}
# S3 Bucket for hosting the Helm charts
resource "aws_s3_bucket" "helmchart" {
  bucket = "helmchart"
}

resource "aws_s3_bucket_ownership_controls" "helmchart_controls" {
  bucket = aws_s3_bucket.helmchart.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "helmchart_public_access_block" {
  bucket = aws_s3_bucket.helmchart.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "helmchart_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.helmchart_controls,
    aws_s3_bucket_public_access_block.helmchart_public_access_block,
  ]

  bucket = aws_s3_bucket.helmchart.id
  acl    = "public-read"
}

# Add a bucket policy to allow public read access to the bucket
resource "aws_s3_bucket_policy" "helmchart_policy" {
  bucket = aws_s3_bucket.helmchart.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.helmchart.arn}/*"
      }
    ]
  })
}
