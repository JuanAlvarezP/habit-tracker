# 🔐 Pipeline de Seguridad - SAST & DAST

## 📋 Descripción General

Este pipeline implementa análisis de seguridad automatizado usando **CircleCI** con dos herramientas principales:

- **SAST (Static Application Security Testing)**: ESLint con plugin de seguridad
- **DAST (Dynamic Application Security Testing)**: OWASP ZAP

---

## 🏗️ Arquitectura del Pipeline

```
┌─────────────────────────────────────────────────┐
│  1. SAST - Análisis Estático (ESLint)         │
│     • Escanea código fuente                    │
│     • Detecta vulnerabilidades en código       │
│     • Genera reportes HTML y JSON              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. Build & Deploy                              │
│     • Construye backend (Django)                │
│     • Construye frontend (React)                │
│     • Levanta aplicación para pruebas           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. DAST - Análisis Dinámico (OWASP ZAP)       │
│     • Escanea aplicación en ejecución           │
│     • Detecta vulnerabilidades en tiempo real   │
│     • Genera reportes de seguridad              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. Reporte Consolidado                         │
│     • Resume resultados de ambos análisis       │
│     • Disponible en Artifacts                   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Configuración Inicial

### 1. Conectar el Repositorio con CircleCI

1. Ve a [CircleCI](https://circleci.com/)
2. Inicia sesión con tu cuenta de GitHub
3. Selecciona tu repositorio `habit-tracker`
4. Click en "Set Up Project"
5. CircleCI detectará automáticamente el archivo `.circleci/config.yml`

### 2. Instalar Dependencias de ESLint (Local)

```bash
cd habit-tracker-frontend
npm install
```

Esto instalará:

- `eslint`: Linter principal
- `eslint-plugin-security`: Plugin para detectar vulnerabilidades
- `eslint-plugin-react`: Reglas para React
- `eslint-plugin-react-hooks`: Reglas para React Hooks

---

## 🔍 SAST - Análisis Estático con ESLint

### ¿Qué detecta?

El análisis estático revisa el código fuente **sin ejecutarlo** y detecta:

- ✅ Uso de `eval()` (inyección de código)
- ✅ Expresiones regulares inseguras
- ✅ Manipulación insegura de objetos
- ✅ Procesos child inseguros
- ✅ Uso de funciones criptográficas débiles
- ✅ Vulnerabilidades de timing attacks
- ✅ Inyección de comandos
- ✅ Path traversal

### Ejecutar manualmente

```bash
cd habit-tracker-frontend
npm run lint
```

### Configuración

El archivo [.eslintrc.json](habit-tracker-frontend/.eslintrc.json) contiene:

- **Plugins de seguridad**: `eslint-plugin-security`
- **Reglas personalizadas**: Detectan patrones inseguros
- **Severidades**: `error` (bloquea) y `warn` (advierte)

---

## 🎯 DAST - Análisis Dinámico con OWASP ZAP

### ¿Qué detecta?

El análisis dinámico **ejecuta la aplicación** y realiza pruebas de penetración:

- ✅ Inyección SQL
- ✅ Cross-Site Scripting (XSS)
- ✅ Cross-Site Request Forgery (CSRF)
- ✅ Configuraciones inseguras
- ✅ Headers de seguridad faltantes
- ✅ Exposición de información sensible
- ✅ Vulnerabilidades de autenticación
- ✅ Problemas de sesión

### Tipos de escaneo en el pipeline

1. **Frontend Scan**: `http://localhost:3000`

   - Analiza la aplicación React
   - Detecta XSS, CSRF, etc.

2. **API Scan**: `http://localhost:8000/api/habits/`
   - Analiza endpoints REST
   - Detecta inyecciones, auth issues

### Instalar OWASP ZAP localmente (opcional)

```bash
# macOS
brew install --cask owasp-zap

# O descargar desde:
# https://www.zaproxy.org/download/
```

Para ejecutar manualmente:

```bash
# Primero inicia tu aplicación
python manage.py runserver &
cd habit-tracker-frontend && npm start &

# Luego ejecuta ZAP
zap.sh -cmd -quickurl http://localhost:3000 -quickout zap-report.html
```

---

## 📊 Interpretando los Reportes

### Reportes de ESLint (SAST)

Los reportes se encuentran en **CircleCI Artifacts → sast-reports/**

**Severidades:**

- 🔴 **Error**: Vulnerabilidad crítica, debe corregirse
- 🟡 **Warning**: Posible problema, revisar
- 🔵 **Info**: Sugerencia de mejora

**Ejemplo de issue:**

```json
{
  "ruleId": "security/detect-eval-with-expression",
  "severity": 2,
  "message": "Detected eval() which can allow code injection",
  "line": 45,
  "column": 10
}
```

### Reportes de OWASP ZAP (DAST)

Los reportes se encuentran en **CircleCI Artifacts → dast-reports/**

**Niveles de riesgo:**

- 🔴 **High**: Vulnerabilidad crítica
- 🟠 **Medium**: Vulnerabilidad moderada
- 🟡 **Low**: Vulnerabilidad menor
- 🔵 **Informational**: Información útil

**Campos importantes:**

- **Alert**: Tipo de vulnerabilidad
- **Risk**: Nivel de riesgo
- **URL**: Dónde se encontró
- **Description**: Qué es la vulnerabilidad
- **Solution**: Cómo corregirla

---

## 🧪 Pruebas del Pipeline

### Ejecutar localmente (antes de push)

```bash
# 1. Prueba ESLint
cd habit-tracker-frontend
npm run lint

# 2. Levanta la aplicación
cd ..
python manage.py runserver &
cd habit-tracker-frontend && npm start &

# 3. Verifica que funcione
curl http://localhost:8000/api/habits/
curl http://localhost:3000/
```

### Ejecutar en CircleCI

1. Haz commit de los cambios:

```bash
git add .circleci/ habit-tracker-frontend/.eslintrc.json habit-tracker-frontend/package.json
git commit -m "feat: Agregar pipeline SAST y DAST"
git push origin main
```

2. Ve a [CircleCI](https://app.circleci.com/)
3. Observa la ejecución del pipeline
4. Revisa los artifacts cuando termine

---

## 📈 Workflow del Pipeline

### Jobs ejecutados en orden:

1. **🔍 SAST - Análisis Estático** (~2-3 min)

   - Instala dependencias
   - Ejecuta ESLint
   - Genera reportes

2. **🏗️ Build & Deploy** (~3-4 min)

   - Construye backend y frontend
   - Levanta servidores
   - Prepara para DAST

3. **🎯 DAST - Análisis Dinámico** (~5-7 min)

   - Instala OWASP ZAP
   - Escanea aplicación
   - Genera reportes

4. **📊 Reporte de Seguridad** (~30 seg)
   - Consolida resultados
   - Muestra resumen

**Tiempo total:** ~10-15 minutos

---

## 🔧 Personalización

### Agregar más reglas de ESLint

Edita [.eslintrc.json](habit-tracker-frontend/.eslintrc.json):

```json
{
  "rules": {
    "security/detect-object-injection": "error",
    "no-eval": "error",
    "no-implied-eval": "error"
  }
}
```

### Modificar escaneo de OWASP ZAP

Edita [.circleci/config.yml](.circleci/config.yml):

```yaml
# Cambiar de baseline scan a full scan (más lento pero completo)
/tmp/ZAP_2.14.0/zap.sh -cmd \
-quickurl http://localhost:3000 \
-quickprogress \
-quickout ~/test-results/zap/zap-report.html
```

Para un escaneo más agresivo:

```yaml
# Spider + Active Scan (puede tomar 30+ minutos)
/tmp/ZAP_2.14.0/zap.sh -cmd \
-autorun ~/zap-config.yaml
```

---

## 🎓 Para el Taller Universitario

### Preguntas Clave a Responder:

1. **¿Qué diferencia hay entre SAST y DAST?**

   - SAST: Analiza código estático (sin ejecutar)
   - DAST: Analiza aplicación en ejecución

2. **¿Cuándo usar cada uno?**

   - SAST: Durante desarrollo (pre-commit)
   - DAST: Antes de desplegar (pre-production)

3. **¿Por qué ambos?**
   - SAST encuentra problemas en el código
   - DAST encuentra problemas en runtime
   - Complementarios, no excluyentes

### Demostración en Clase:

1. Mostrar código con vulnerabilidad (ej: `eval()`)
2. Ejecutar SAST → Detecta el problema
3. Corregir el código
4. Ejecutar DAST → Verificar que funciona seguro
5. Revisar reportes y explicar hallazgos

### Ejercicios Prácticos:

1. **Introducir una vulnerabilidad intencional**

   ```javascript
   // En algún componente
   const data = eval(userInput); // ❌ Inseguro
   ```

2. **Ejecutar el pipeline**

   ```bash
   git commit -m "test: Agregar vulnerabilidad para demo"
   git push
   ```

3. **Observar que ESLint la detecta**

4. **Corregir y volver a ejecutar**
   ```javascript
   const data = JSON.parse(userInput); // ✅ Seguro
   ```

---

## 📚 Recursos Adicionales

### Documentación:

- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CircleCI Documentation](https://circleci.com/docs/)

### Videos y Tutoriales:

- [OWASP ZAP Tutorial](https://www.youtube.com/watch?v=zRrpRE5gXkI)
- [ESLint Security Best Practices](https://eslint.org/docs/latest/use/getting-started)

---

## ❓ Troubleshooting

### Problema: ESLint no encuentra errores

**Solución:**

```bash
cd habit-tracker-frontend
rm -rf node_modules package-lock.json
npm install
npm run lint
```

### Problema: OWASP ZAP no puede conectarse

**Solución:**

- Verificar que los servidores estén corriendo
- Aumentar el `sleep` tiempo en el config
- Revisar logs de los servidores

### Problema: CircleCI falla en Build

**Solución:**

- Verificar que `requirements.txt` esté actualizado
- Verificar que `package.json` tenga todas las dependencias
- Revisar logs en CircleCI dashboard

---

## ✅ Checklist para el Taller

- [ ] Pipeline configurado en CircleCI
- [ ] SAST ejecutándose correctamente
- [ ] DAST ejecutándose correctamente
- [ ] Reportes generándose en Artifacts
- [ ] Vulnerabilidad de demo introducida y detectada
- [ ] Documentación revisada
- [ ] Presentación preparada

---

## 📝 Notas del Profesor

Este pipeline está diseñado para ser **educativo** y **práctico**:

- ✅ Usa herramientas gratuitas y open-source
- ✅ Se ejecuta automáticamente en cada push
- ✅ Genera reportes fáciles de entender
- ✅ Cubre tanto SAST como DAST
- ✅ Es extensible para agregar más herramientas

**Duración sugerida del taller:** 2-3 horas

- 30 min: Teoría SAST/DAST
- 45 min: Configuración y demo del pipeline
- 45 min: Ejercicios prácticos
- 30 min: Análisis de reportes y Q&A

---

## 🤝 Contribuciones

Para mejorar este pipeline:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/mejora`
3. Haz tus cambios
4. Push y crea Pull Request

---

**Creado para:** Taller Universitario de DevSecOps  
**Fecha:** Enero 2026  
**Herramientas:** CircleCI, ESLint, OWASP ZAP
