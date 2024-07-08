# ingress.tpl
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aiq
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  ingressClassName: nginx
  rules:
    - host: ${elb_dns}
      http:
        paths:
          - path: /api/auth
            pathType: Prefix
            backend:
              service:
                name: aiqauth
                port:
                  number: 4000
          - path: /api/post
            pathType: Prefix
            backend:
              service:
                name: aiqpost
                port:
                  number: 4003
          - path: /api/user
            pathType: Prefix
            backend:
              service:
                name: aiquser
                port:
                  number: 4001
          - path: /api/comment
            pathType: Prefix
            backend:
              service:
                name: aiqpost
                port:
                  number: 4003