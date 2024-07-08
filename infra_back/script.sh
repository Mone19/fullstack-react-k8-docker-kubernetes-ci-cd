#!/bin/bash
set -e

NAMESPACE="argocd"

# Set the current namespace to argocd
kubectl config set-context --current --namespace=$NAMESPACE

echo "Waiting for all ArgoCD pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=server --namespace=$NAMESPACE --timeout=600s
echo "All ArgoCD pods are ready."

echo "Patching the ArgoCD server service to be of type LoadBalancer..."
kubectl patch svc argocd-server -n argocd -p "{\"spec\": {\"type\": \"LoadBalancer\"}}"

echo "Waiting for LoadBalancer to get an external IP..."
EXTERNAL_IP=""
while [ -z "$EXTERNAL_IP" ]; do
    EXTERNAL_IP=$(kubectl get svc argocd-server -n argocd -o jsonpath="{.status.loadBalancer.ingress[0].hostname}" 2>/dev/null || echo "")
    if [ -z "$EXTERNAL_IP" ]; then
        echo "Still waiting..."
        sleep 10
    fi
done
echo "External IP obtained: $EXTERNAL_IP"

# Retrieve the admin password
ADMIN_PASSWORD=$(kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 --decode)
if [ -z "$ADMIN_PASSWORD" ]; then
    echo "Failed to retrieve admin password"
    exit 1
fi
echo "Retrieved admin password: $ADMIN_PASSWORD"

# Retry loop for logging in to ArgoCD
echo "Attempting to log in to ArgoCD..."
LOGIN_SUCCESS=0
while [ $LOGIN_SUCCESS -eq 0 ]; do
    if echo "y" | argocd login "$EXTERNAL_IP" --username admin --password "$ADMIN_PASSWORD"; then
        LOGIN_SUCCESS=1
        echo "Successfully logged in to ArgoCD."
    else
        echo "Login failed, retrying in 10 seconds..."
        sleep 10
    fi
done

# Add the GitHub repository to ArgoCD
echo "Adding GitHub repository to ArgoCD..."
argocd repo add https://github.com/Ki-Blog/BlogMitDashboard.git --username  --password 
echo "GitHub repository added."

# Apply the ArgoCD manifest
echo "Applying ArgoCD manifest..."
kubectl apply -f argocd.yml
echo "ArgoCD manifest applied."

# Revert the service type to ClusterIP
echo "Reverting the ArgoCD server service to ClusterIP..."
kubectl patch svc argocd-server -n argocd -p "{\"spec\": {\"type\": \"ClusterIP\"}}"
echo "ArgoCD server service reverted to ClusterIP."

# Start port-forwarding
#echo "Starting port-forwarding to make ArgoCD accessible locally..."
#kubectl port-forward svc/argocd-server -n argocd 8080:443 &

echo "Port-forwarding started. ArgoCD is accessible at https://localhost:8080"

# Reset the namespace to default
kubectl config set-context --current --namespace=default
