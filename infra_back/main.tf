resource "null_resource" "helm_repo_update" {
  provisioner "local-exec" {
    command = "helm repo add argo https://argoproj.github.io/argo-helm && helm repo update"
  }

  depends_on = [null_resource.update_kubeconfig]
}

resource "helm_release" "argocd" {
  name            = "argocd"
  repository      = "https://argoproj.github.io/argo-helm"
  chart           = "argo-cd"
  create_namespace = true
  namespace       = "argocd"

  depends_on = [null_resource.helm_repo_update]
}



resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "ingress-nginx"
  create_namespace = true

    depends_on = [null_resource.helm_repo_update]
}





data "kubernetes_service" "ingress_nginx" {
metadata {
name = "ingress-nginx-controller"
namespace = "ingress-nginx"
}
depends_on = [helm_release.ingress_nginx]
}


# data "template_file" "ingress_template" {
#   template = file("${path.module}/../k8s/ingress.tpl")

#   vars = {
#     elb_dns = data.kubernetes_service.ingress_nginx.status.0.load_balancer.0.ingress.0.hostname
#   }

# }
# resource "local_file" "ingress_yaml" {
#   filename = "${path.module}/../k8s/BlogDashboard-chart/templates/ingress.yaml"
#   content  = data.template_file.ingress_template.rendered

#   depends_on = [data.template_file.ingress_template]
# }

resource "local_file" "argocd_manifest" {
  content = templatefile("${path.module}/argocd.tpl", {
    repo_url  = "https://helmchart.s3.amazonaws.com/charts"
    chart     = "BlogDashborad-chart"
    revision  = "*"
    namespace = "default"
  })
  filename = "${path.module}/argocd.yml"
}

resource "null_resource" "apply_argocd_manifest" {
  provisioner "local-exec" {
    command = "kubectl apply -f ${local_file.argocd_manifest.filename}"
  }

  provisioner "local-exec" {
    command = <<EOT
      echo "Waiting for ArgoCD to be ready..."
      kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=server --namespace=argocd --timeout=600s
      echo "ArgoCD is ready. Triggering sync..."
      curl -X POST https://${var.argocd_server}/api/v1/applications/blog-dashboard/sync -H "Authorization: Bearer ${var.argocd_auth_token}"
    EOT
    when = create
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

variable "argocd_server" {
  description = "The URL of the ArgoCD server"
}

variable "argocd_auth_token" {
  description = "The authentication token for ArgoCD"
}

/* resource "null_resource" "patch_and_login" {
  provisioner "local-exec" {
    command = "sh script.sh"
  }
}
 */
resource "null_resource" "helm_repo_prometheus" {
  provisioner "local-exec" {
    command = "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && helm repo update"
  }

  depends_on = [null_resource.helm_repo_update]
}

resource "helm_release" "kube_prometheus_stack" {
  name             = "kube-prometheus-stack"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  namespace        = "prometheus"
  create_namespace = true

  depends_on = [null_resource.helm_repo_prometheus]
}