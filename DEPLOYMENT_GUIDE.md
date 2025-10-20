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

Pasos rápidos (desde la raíz del repositorio):

```bash
# Dar permisos al script (la primera vez)
chmod +x scripts/run_local_prod.sh

# Ejecutar el script (crea un venv local, instala dependencias, corre linters y tests,
# construye frontend y empaqueta artefactos en /tmp/habit-tracker-prod)
./scripts/run_local_prod.sh
```

Qué hace el script:

- Crea un virtualenv y instala dependencias del backend.
- Ejecuta migraciones locales (sqlite) y pruebas con coverage.
- Corre flake8 (si está instalado)
- Construye el frontend con `npm run build` (si existe)
- Empaqueta artefactos en `/tmp/habit-tracker-prod` y opcionalmente arranca Gunicorn como prueba de humo.

Si prefieres ejecutar las etapas manualmente, sigue lo que hace el `Jenkinsfile`:

- Checkout del repo
- Crear venv e instalar dependencias
- python manage.py makemigrations && python manage.py migrate
- flake8 --exclude=migrations,venv .
- coverage run -m pytest && coverage report -m
- (cd habit-tracker-frontend && npm ci && npm run build)
- rsync de artefactos a /tmp/habit-tracker-prod
- collectstatic y arrancar gunicorn para smoke test

Notas:

- El `Jenkinsfile` y el script están pensados para ejecución local y educativa: no contienen manejo de secretos ni despliegue real a servidores remotos.
- Ajusta los nombres de las herramientas (ej. `node18` en Jenkins) según tu instalación local.
