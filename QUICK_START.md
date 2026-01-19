# 🚀 Quick Start - CI/CD Pipeline

## Para ejecutar el proyecto completo:

### 1️⃣ Pipeline CI (CircleCI)

```bash
# Conectar repositorio con CircleCI
1. Ir a https://circleci.com
2. Login con GitHub
3. Seleccionar repositorio 'habit-tracker'
4. El pipeline iniciará automáticamente

# Hacer un push para trigger el pipeline
git add .
git commit -m "feat: Initial CI/CD setup"
git push origin main
```

### 2️⃣ Build imágenes Docker localmente (opcional)

```bash
# Backend
docker build -t habit-tracker-backend:v1.0 -f Dockerfile.backend .

# Frontend
cd habit-tracker-frontend
docker build -t habit-tracker-frontend:v1.0 -f ../Dockerfile.frontend .
```

### 3️⃣ Deploy en Kubernetes

```bash
# Aplicar manifiestos
kubectl apply -f k8s/

# Verificar
kubectl get all -n habit-tracker

# Acceder a la aplicación
kubectl port-forward svc/frontend-service -n habit-tracker 3000:80
# http://localhost:3000
```

### 4️⃣ Instalar ArgoCD

```bash
# Instalar ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Acceder a ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Obtener password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Aplicar aplicación
kubectl apply -f argocd/
```

### 5️⃣ Instalar Kyverno (Políticas)

```bash
# Instalar Kyverno
helm repo add kyverno https://kyverno.github.io/kyverno/
helm install kyverno kyverno/kyverno -n kyverno --create-namespace

# Aplicar políticas
kubectl apply -f policies/
```

---

## 📊 Verificar que todo funciona

```bash
# Ver pipeline CI en CircleCI
https://app.circleci.com

# Ver aplicación en ArgoCD
http://localhost:8080

# Ver pods en Kubernetes
kubectl get pods -n habit-tracker

# Ver políticas aplicadas
kubectl get clusterpolicies
```

---

## 🎯 Dos Pipelines Separados

### **Pipeline CI (CircleCI)**

- Build
- Tests
- SAST (ESLint)
- DAST (SQLMap)
- Docker build
- Security scan (Trivy)

### **Pipeline CD (ArgoCD)**

- GitOps
- Deploy automático
- Validación de políticas (Kyverno)
- Auto-healing
- Health checks

---

Ver **CI_CD_GUIDE.md** para documentación completa.
