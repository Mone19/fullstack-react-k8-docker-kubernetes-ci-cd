output "availibility_zones" {
  value = data.aws_availability_zones.availibility_zones.names
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "ingress_nginx_controller_public_hostname" {
value = data.kubernetes_service.ingress_nginx.status.0.load_balancer.0.ingress.0.hostname
}