# Configuración para Producción - Habit Tracker

## Variables de Entorno Necesarias

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database_name

# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS Settings
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Static files (if using cloud storage)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket-name
```

## Archivos de Configuración Necesarios

### 1. requirements.txt (para producción)

```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
psycopg2-binary==2.9.7
gunicorn==21.2.0
whitenoise==6.6.0
dj-database-url==2.1.0
```

### 2. Procfile (para Heroku/Railway)

```
web: gunicorn habit_tracker_backend.wsgi:application --bind 0.0.0.0:$PORT
release: python manage.py migrate
```

### 3. runtime.txt (especificar versión Python)

```
python-3.11.6
```

## Checklist de Producción Django

- [ ] Configurar variables de entorno
- [ ] Actualizar ALLOWED_HOSTS
- [ ] Configurar base de datos PostgreSQL
- [ ] Configurar archivos estáticos con WhiteNoise
- [ ] Configurar CORS para el frontend
- [ ] Habilitar HTTPS en producción
- [ ] Configurar logging para producción
- [ ] Ejecutar collectstatic
- [ ] Ejecutar migraciones en producción

## Ejecutar pipeline (versión de tarea / local)

Para la tarea de la universidad hemos adaptado un `Jenkinsfile` para que haga un despliegue simulado en local. Si no tienes Jenkins disponible, puedes ejecutar los pasos principales mediante el script incluido `scripts/run_local_prod.sh`.

### Opción 1: Iniciar servidores de desarrollo (RECOMENDADO)

Para ejecutar ambos servidores localmente (Backend en puerto 8000 y Frontend en puerto 3000):

```bash
# Dar permisos a los scripts (la primera vez)
chmod +x scripts/start_local_servers.sh scripts/stop_local_servers.sh

# Iniciar ambos servidores
./scripts/start_local_servers.sh

# Abrir en el navegador:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000

# Para detener los servidores:
./scripts/stop_local_servers.sh
```

### Opción 2: Ejecutar el pipeline completo (para demostración)

```bash
# Dar permisos al script (la primera vez)
chmod +x scripts/run_local_prod.sh

# Ejecutar el script (crea un venv local, instala dependencias, corre linters y tests,
# construye frontend y empaqueta artefactos en /tmp/habit-tracker-prod)
./scripts/run_local_prod.sh
```

### Opción 3: Ejecutar solo los tests

**Tests del Backend (Django/Python):**

```bash
# Crear virtualenv e instalar dependencias
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install pytest pytest-django coverage

# Ejecutar migraciones
export DJANGO_SETTINGS_MODULE=habit_tracker_backend.settings
python manage.py migrate

# Ejecutar tests con pytest
pytest habits/tests.py -v

# Ejecutar tests con coverage
coverage run -m pytest
coverage report -m
```

**Tests del Frontend (React/Jest):**

```bash
cd habit-tracker-frontend
npm install
npm test -- --ci --watchAll=false
```

### Qué hace el Jenkinsfile:

1. **Checkout**: Clona el repositorio
2. **Backend CI**:
   - Crea virtualenv e instala dependencias
   - Ejecuta migraciones
   - Corre flake8 (linter)
   - Ejecuta 4 tests unitarios con pytest y coverage
3. **Frontend CI**:
   - Instala dependencias con npm
   - Ejecuta ESLint (linter)
   - Ejecuta 6 tests unitarios con Jest
   - Construye el frontend para producción
4. **Despliegue Simulado**: Empaqueta artefactos en `/tmp/habit-tracker-prod`
5. **Smoke Test**: Levanta Gunicorn y hace una petición de prueba
6. **Start Local Servers**: Inicia Django (puerto 8000) y React (puerto 3000)

### Tests implementados:

**Backend (4 tests en `habits/tests.py`):**

- Test 1: Creación correcta de un hábito
- Test 2: Representación en string del hábito
- Test 3: Creación de log diario
- Test 4: Toggle del estado de completado

**Frontend (6 tests - 4 en `HabitCard.test.js` + 2 en `App.test.js`):**

- Test 1-4: Validación de estructura y propiedades del objeto hábito
- Test 5-6: Tests básicos de configuración del entorno

Notas:

- El `Jenkinsfile` y los scripts están pensados para ejecución local y educativa: no contienen manejo de secretos ni despliegue real a servidores remotos.
- Ajusta los nombres de las herramientas (ej. `Node.js 18` en Jenkins) según tu instalación local.
- Los servidores se ejecutan en background. Revisa los logs en `django_server.log` y `react_server.log`.
