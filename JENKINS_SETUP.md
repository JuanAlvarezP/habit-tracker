# 🚀 Guía de Ejecución del Pipeline Jenkins - Habit Tracker

## 📋 Problema común y solución

### ❌ Problema: Los servidores no quedan corriendo después del pipeline

**Causa**: Jenkins mata todos los procesos hijos cuando el job termina, incluso con `nohup`.

**Soluciones disponibles**:

---

## ✅ SOLUCIÓN 1: Usar scripts manuales (RECOMENDADO para demostración)

Esta es la forma más confiable para demostraciones universitarias:

### Paso 1: Ejecutar el pipeline en Jenkins

1. Abre Jenkins en http://localhost:8080
2. Ejecuta el job `habit-tracker-pipeline`
3. Espera a que termine ✅ (esto valida tests, linters, build)

### Paso 2: Iniciar servidores manualmente

```bash
cd /Users/juanalvarez/Documents/CARRERA\ ING.SOFTWARE/PROYECTOS\ O\ CÓDIGOS\ DE\ PRÁCTICA/PROYECTOS\ PERSONALES/habit-tracker

# Iniciar ambos servidores
./scripts/start_local_servers.sh
```

### Paso 3: Verificar que funcionan

```bash
# Ver procesos corriendo
ps aux | grep -E "(manage.py runserver|react-scripts)" | grep -v grep

# O revisar los logs
tail -f django_server.log
tail -f react_server.log
```

### Paso 4: Abrir en el navegador

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

### Paso 5: Detener servidores cuando termines

```bash
./scripts/stop_local_servers.sh
```

---

## ✅ SOLUCIÓN 2: Pipeline con BUILD_ID=dontKillMe (ya implementado)

El `Jenkinsfile` ahora incluye `BUILD_ID=dontKillMe` que intenta mantener los procesos vivos.

**Cómo verificar si funcionó**:

Después de que el pipeline termine, ejecuta:

```bash
# Ver si los procesos siguen corriendo
ps aux | grep -E "(manage.py runserver|react-scripts)" | grep -v grep

# Ver los PIDs guardados
cat django_server.pid
cat react_server.pid

# Verificar que los puertos estén escuchando
lsof -i :8000  # Django
lsof -i :3000  # React
```

**Si los servidores están corriendo**:

- ✅ Abre http://localhost:3000 en tu navegador
- ✅ La app debería funcionar

**Si NO están corriendo**:

- Revisa los logs: `cat django_server.log` y `cat react_server.log`
- Usa la **Solución 1** (script manual)

---

## 🔧 Troubleshooting

### Los servidores no inician

**Verificar logs**:

```bash
# Ver últimas líneas del log de Django
tail -20 django_server.log

# Ver últimas líneas del log de React
tail -20 react_server.log
```

**Errores comunes**:

1. **Puerto ya en uso**:

   ```bash
   # Matar proceso en puerto 8000
   lsof -ti :8000 | xargs kill -9

   # Matar proceso en puerto 3000
   lsof -ti :3000 | xargs kill -9
   ```

2. **Dependencias faltantes**:

   ```bash
   # Backend
   source venv/bin/activate
   pip install -r requirements.txt

   # Frontend
   cd habit-tracker-frontend
   npm install
   ```

3. **Migraciones pendientes**:
   ```bash
   source venv/bin/activate
   export DJANGO_SETTINGS_MODULE=habit_tracker_backend.settings
   python manage.py migrate
   ```

### Jenkins no encuentra herramientas (Python, Node)

Agregar al inicio del `Jenkinsfile`:

```groovy
environment {
    PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:${env.PATH}"
    // ... resto de variables
}
```

---

## 📸 Para la demostración universitaria

### Opción A: Mostrar Jenkins + App funcionando

1. **Captura 1**: Jenkins Dashboard con el job
2. **Captura 2**: Build ejecutándose (Console Output)
3. **Captura 3**: Build exitoso ✅
4. **Ejecuta**: `./scripts/start_local_servers.sh`
5. **Captura 4**: App funcionando en http://localhost:3000
6. **Captura 5**: Tests pasando (de los logs de Jenkins)

### Opción B: Solo con scripts (sin Jenkins instalado)

```bash
# 1. Ejecutar pipeline completo
./scripts/run_local_prod.sh

# 2. Ver que los tests pasaron
pytest habits/tests.py -v
cd habit-tracker-frontend && npm test -- --ci --watchAll=false

# 3. Iniciar servidores
./scripts/start_local_servers.sh

# 4. Abrir http://localhost:3000
```

---

## 📊 Verificación completa

### Script de verificación rápida:

```bash
#!/bin/bash
echo "🔍 Verificando estado del sistema..."
echo ""

# Verificar procesos
echo "📋 Procesos corriendo:"
ps aux | grep -E "(manage.py runserver|react-scripts)" | grep -v grep || echo "❌ No hay servidores corriendo"
echo ""

# Verificar puertos
echo "🌐 Puertos escuchando:"
lsof -i :8000 && echo "✅ Puerto 8000 (Django) OK" || echo "❌ Puerto 8000 no disponible"
lsof -i :3000 && echo "✅ Puerto 3000 (React) OK" || echo "❌ Puerto 3000 no disponible"
echo ""

# Verificar PIDs
echo "📄 Archivos PID:"
[ -f django_server.pid ] && echo "✅ django_server.pid existe" || echo "❌ django_server.pid no encontrado"
[ -f react_server.pid ] && echo "✅ react_server.pid existe" || echo "❌ react_server.pid no encontrado"
echo ""

# Test de conectividad
echo "🔗 Test de conectividad:"
curl -s http://localhost:8000 > /dev/null && echo "✅ Django responde" || echo "❌ Django no responde"
curl -s http://localhost:3000 > /dev/null && echo "✅ React responde" || echo "❌ React no responde"
```

Guarda esto como `scripts/check_status.sh` y ejecútalo para verificar todo.

---

## 🎓 Resumen para la tarea

1. ✅ **Jenkins ejecuta el pipeline**: Tests, linters, build
2. ✅ **Script manual inicia servidores**: `./scripts/start_local_servers.sh`
3. ✅ **App funciona en localhost:3000**: Lista para demostrar
4. ✅ **Documentación completa**: Jenkins, tests, deployment

**Comando único para demostración rápida**:

```bash
./scripts/start_local_servers.sh && open http://localhost:3000
```

Esto abrirá automáticamente la app en tu navegador por defecto.
