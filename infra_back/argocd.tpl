apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: blog-dashboard
  namespace: argocd
spec:
  project: default
  source:
    repoURL: "${repo_url}"
    chart: "${chart}"
    targetRevision: "${revision}"
  destination:
    server: https://kubernetes.default.svc
    namespace: ${namespace}
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
