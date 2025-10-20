# 🔔 Configuración de Notificaciones GitHub en Jenkins

Este documento explica cómo configurar las notificaciones del pipeline de Jenkins para que aparezcan en GitHub.

## 📊 Qué muestra en GitHub

Una vez configurado correctamente, verás:

### 1. En la página del commit:

```
✅ Jenkins CI/CD Pipeline — Pipeline completado exitosamente
⏳ Jenkins CI/CD Pipeline — Pipeline en ejecución...
❌ Jenkins CI/CD Pipeline — Pipeline falló - revisar logs
```

### 2. En Pull Requests:

- Estado del build en la vista de PR
- Bloqueo de merge si el build falla (opcional)
- Link directo a los logs de Jenkins

### 3. En el repositorio:

- Badge de estado del último build
- Historial de builds por commit

## 🔧 Configuración Paso a Paso

### Paso 1: Crear Personal Access Token en GitHub

1. Ve a GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**

2. Click en **"Generate new token (classic)"**

3. Configuración del token:

   - **Note**: `Jenkins CI/CD Token`
   - **Expiration**: 90 days (o sin expiración si lo prefieres)
   - **Scopes** (permisos):
     - ✅ `repo` (Full control of private repositories)
       - ✅ `repo:status` (Access commit status)
       - ✅ `repo_deployment` (Access deployment status)
       - ✅ `public_repo` (Access public repositories)

4. Click **"Generate token"**

5. **IMPORTANTE**: Copia el token inmediatamente (solo se muestra una vez)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Paso 2: Instalar Plugins en Jenkins

1. Abre Jenkins: http://localhost:8080

2. Ve a **Manage Jenkins** → **Manage Plugins**

3. Tab **"Available plugins"**, busca e instala:

   - ✅ **GitHub Plugin**
   - ✅ **GitHub Branch Source Plugin**
   - ✅ **Pipeline: GitHub**

4. Click **"Install without restart"** o reinicia Jenkins

### Paso 3: Configurar Credenciales en Jenkins

1. Ve a **Manage Jenkins** → **Manage Credentials**

2. Click en **(global)** → **Add Credentials**

3. Configuración:

   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: Pega tu GitHub token (ghp_xxx...)
   - **ID**: `github-token` (debe coincidir con el Jenkinsfile)
   - **Description**: `GitHub Personal Access Token for CI/CD`

4. Click **"Create"**

### Paso 4: Verificar configuración en el Jenkinsfile

El `Jenkinsfile` ya está configurado con:

```groovy
environment {
    GITHUB_TOKEN = credentials('github-token')
    GITHUB_REPO_OWNER = 'JuanAlvarezP'
    GITHUB_REPO_NAME = 'habit-tracker'
}
```

**IMPORTANTE**: Verifica que `GITHUB_REPO_OWNER` y `GITHUB_REPO_NAME` sean correctos para tu repositorio.

### Paso 5: Ejecutar el Pipeline

1. Ve a tu job en Jenkins

2. Click **"Build Now"**

3. El pipeline:
   - Enviará estado "pending" al inicio
   - Enviará "success" o "failure" al final
   - Incluirá link a Jenkins en la notificación

## 📍 Dónde Ver las Notificaciones

### En GitHub - Página de Commits

1. Ve a tu repo: https://github.com/JuanAlvarezP/habit-tracker

2. Click en **"Commits"** o ve a: https://github.com/JuanAlvarezP/habit-tracker/commits/main

3. Verás junto a cada commit:

   ```
   ✅ Jenkins CI/CD Pipeline
   ```

4. Click en el ✅ para ver detalles y link a Jenkins

### En un Commit Específico

1. Abre cualquier commit: https://github.com/JuanAlvarezP/habit-tracker/commit/[hash]

2. Verás una sección de **"Checks"** o **"Status checks"**

3. Muestra:
   - Estado del build (success/failure/pending)
   - Link a Jenkins console output
   - Descripción del resultado

### En Pull Requests (si usas)

1. Crea un PR desde una rama

2. En la vista del PR verás:
   ```
   ✅ All checks have passed
   1 successful check
     ✅ Jenkins CI/CD Pipeline — Pipeline completado exitosamente
   ```

## 🔍 Qué Hace el Pipeline

### Stage 1: Notify Start

```groovy
stage('Notify Start') {
    // Envía estado "pending" a GitHub
    // Muestra: ⏳ Pipeline en ejecución...
}
```

### Durante la ejecución

- GitHub muestra el commit con estado "pending"
- Icono amarillo/naranja ⏳

### Al finalizar (bloque post)

```groovy
post {
    always {
        // Envía estado final a GitHub
        // success → ✅ Pipeline completado exitosamente
        // failure → ❌ Pipeline falló - revisar logs
    }
}
```

## 📡 API de GitHub Usada

El pipeline usa la **GitHub Status API**:

```bash
curl -X POST \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/statuses/${COMMIT_SHA} \
  -d '{
    "state": "success",              # pending, success, error, failure
    "target_url": "${BUILD_URL}",    # Link a Jenkins
    "description": "...",             # Mensaje que se muestra
    "context": "Jenkins CI/CD Pipeline"  # Nombre del check
  }'
```

**Estados posibles:**

- `pending`: Build en progreso ⏳
- `success`: Build exitoso ✅
- `failure`: Build falló ❌
- `error`: Error en el pipeline ⚠️

## 🎨 Badge de Estado (opcional)

Puedes agregar un badge al README.md:

### Opción 1: Badge de Jenkins

```markdown
![Build Status](http://localhost:8080/buildStatus/icon?job=habit-tracker-pipeline)
```

### Opción 2: Badge de GitHub

Usa shields.io:

```markdown
![CI/CD](https://img.shields.io/badge/CI%2FCD-Jenkins-blue)
```

## 🔧 Troubleshooting

### ❌ Error: "Could not update commit status"

**Causa**: Token inválido o sin permisos

**Solución**:

1. Verifica que el token tenga scope `repo:status`
2. Regenera el token si expiró
3. Actualiza las credenciales en Jenkins

### ❌ Error: "401 Unauthorized"

**Causa**: Token incorrecto en Jenkins

**Solución**:

```bash
# En Jenkins Console Output, busca:
curl: (22) The requested URL returned error: 401

# Verifica:
1. Credential ID sea 'github-token'
2. Token esté correctamente copiado
3. Token no haya expirado
```

### ❌ No aparece notificación en GitHub

**Causa**: Variables incorrectas

**Solución**:

```groovy
// Verifica en Jenkinsfile:
GITHUB_REPO_OWNER = 'JuanAlvarezP'  // ← Tu usuario de GitHub
GITHUB_REPO_NAME = 'habit-tracker'   // ← Nombre exacto del repo
```

### ⚠️ Notificación "pending" pero nunca cambia

**Causa**: Pipeline falló antes de enviar notificación final

**Solución**:

- El bloque `post { always { } }` siempre debería ejecutarse
- Verifica logs de Jenkins para ver si hubo error
- Asegúrate que curl tenga acceso a internet

## 📊 Ver Historial de Notificaciones

### En Jenkins:

1. Abre el build específico
2. Ve a **"Console Output"**
3. Busca:
   ```
   📢 Notificación enviada a GitHub para commit abc123
      Estado: success
      Descripción: ✅ Pipeline completado exitosamente
   ```

### En GitHub:

1. Ve al commit específico
2. Click en el check "Jenkins CI/CD Pipeline"
3. Verás:
   - Link a Jenkins
   - Descripción del estado
   - Timestamp de cuándo se actualizó

## 🎓 Para la Demostración

1. **Hacer un commit**:

   ```bash
   git add .
   git commit -m "Test: Verificar notificaciones GitHub"
   git push origin main
   ```

2. **Ver en GitHub**:

   - Ir a la página de commits
   - Verás estado "pending" mientras corre
   - Cambiará a "success" cuando termine

3. **Captura de pantalla**:
   - GitHub mostrando el check verde ✅
   - Click en el check para mostrar link a Jenkins
   - Jenkins showing successful build

## 🔗 Enlaces Útiles

- [GitHub Status API Docs](https://docs.github.com/en/rest/commits/statuses)
- [Jenkins GitHub Plugin](https://plugins.jenkins.io/github/)
- [Personal Access Tokens](https://github.com/settings/tokens)

---

## ✅ Checklist de Configuración

- [ ] Token de GitHub creado con scope `repo:status`
- [ ] Token guardado en Jenkins con ID `github-token`
- [ ] Plugins de GitHub instalados en Jenkins
- [ ] Variables GITHUB_REPO_OWNER y GITHUB_REPO_NAME correctas
- [ ] Pipeline ejecutado exitosamente
- [ ] Notificación visible en página de commits de GitHub
- [ ] Link a Jenkins funciona desde GitHub
