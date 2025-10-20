#!/usr/bin/env bash
set -euo pipefail

# Script: run_local_prod.sh
# Propósito: Ejecutar localmente los pasos mínimos que Jenkinsfile realiza para la "producción".
# Uso: desde la raíz del repo: ./scripts/run_local_prod.sh

VENV_DIR=venv
TARGET_DIR=/tmp/habit-tracker-prod

echo "1) Creando virtualenv y instalando dependencias (backend)"
python3 -m venv ${VENV_DIR} || python -m venv ${VENV_DIR}
. ${VENV_DIR}/bin/activate
pip install --upgrade pip
pip install -r requirements.txt || pip install -r habit_tracker_backend/requirements.txt || true

echo "2) Ejecutando migraciones (sqlite de dev / local)"
export DJANGO_SETTINGS_MODULE=habit_tracker_backend.settings
python manage.py makemigrations --noinput || true
python manage.py migrate --noinput || true

echo "3) Ejecutando linter (flake8) y tests (pytest)"
. ${VENV_DIR}/bin/activate
flake8 --exclude=migrations,venv,habit-tracker-frontend,build . || true
coverage run -m pytest || true
coverage report -m || true

echo "4) Construyendo frontend"
if [ -d habit-tracker-frontend ]; then
  (cd habit-tracker-frontend && npm ci || npm install)
  (cd habit-tracker-frontend && npm run build || echo "build frontend falló o no está configurado")
fi

echo "5) Empaquetando artefactos en ${TARGET_DIR}"
rm -rf ${TARGET_DIR}
mkdir -p ${TARGET_DIR}/backend
mkdir -p ${TARGET_DIR}/frontend
rsync -av --exclude='venv' --exclude='.git' --exclude='node_modules' . ${TARGET_DIR}/backend/
if [ -d habit-tracker-frontend/build ]; then
  rsync -av habit-tracker-frontend/build/ ${TARGET_DIR}/frontend/
fi

echo "6) Intentando iniciar Gunicorn (si Django está disponible)"
if python - <<'PY' 2>/dev/null
import importlib, sys
try:
    importlib.import_module('django')
    print('django')
except Exception:
    sys.exit(1)
PY
then
  . ${VENV_DIR}/bin/activate
  python manage.py collectstatic --noinput || echo "collectstatic skipped"
  pkill -f 'gunicorn' || true
  nohup ${VENV_DIR}/bin/gunicorn --chdir . habit_tracker_backend.wsgi:application -b 127.0.0.1:8001 --workers 2 > gunicorn.log 2>&1 &
  sleep 3
  curl -f http://127.0.0.1:8001/ || echo "Smoke test falló o endpoint / no está disponible"
else
  echo "Django no está instalado en el entorno; omitiendo arranque de Gunicorn"
fi

echo "Script completado. Revisa ${TARGET_DIR} y gunicorn.log si se inició." 
