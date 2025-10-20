#!/usr/bin/env bash
set -euo pipefail

# Script: start_local_servers.sh
# Propósito: Iniciar ambos servidores (Django en 8000 y React en 3000) localmente
# Uso: ./scripts/start_local_servers.sh

VENV_DIR=venv
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Iniciando servidores locales del Habit Tracker..."
echo ""

# Crear y activar virtualenv si no existe
if [ ! -d "$PROJECT_ROOT/$VENV_DIR" ]; then
    echo "📦 Creando virtualenv..."
    python3 -m venv "$PROJECT_ROOT/$VENV_DIR" || python -m venv "$PROJECT_ROOT/$VENV_DIR"
fi

# Activar virtualenv
. "$PROJECT_ROOT/$VENV_DIR/bin/activate"

# Instalar dependencias de Python
echo "📦 Instalando dependencias de Python..."
pip install -q --upgrade pip
pip install -q -r "$PROJECT_ROOT/requirements.txt" || true

# Migraciones
echo "🗄️  Ejecutando migraciones..."
export DJANGO_SETTINGS_MODULE=habit_tracker_backend.settings
python "$PROJECT_ROOT/manage.py" makemigrations --noinput || true
python "$PROJECT_ROOT/manage.py" migrate --noinput || true

# Detener servidores previos
echo "🛑 Deteniendo servidores previos (si existen)..."
pkill -f 'python.*manage.py runserver' || true
pkill -f 'node.*react-scripts' || true
sleep 2

# Iniciar Django en background
echo "🐍 Iniciando servidor Django en http://localhost:8000 ..."
nohup python "$PROJECT_ROOT/manage.py" runserver 0.0.0.0:8000 > "$PROJECT_ROOT/django_server.log" 2>&1 &
echo $! > "$PROJECT_ROOT/django_server.pid"

# Instalar dependencias de Node si no existen
if [ ! -d "$PROJECT_ROOT/habit-tracker-frontend/node_modules" ]; then
    echo "📦 Instalando dependencias de Node..."
    (cd "$PROJECT_ROOT/habit-tracker-frontend" && npm install)
fi

# Iniciar React en background
echo "⚛️  Iniciando servidor React en http://localhost:3000 ..."
cd "$PROJECT_ROOT/habit-tracker-frontend"
PORT=3000 nohup npm start > "$PROJECT_ROOT/react_server.log" 2>&1 &
echo $! > "$PROJECT_ROOT/react_server.pid"

sleep 3

echo ""
echo "✅ Servidores iniciados correctamente!"
echo ""
echo "🌐 URLs:"
echo "   - Backend (Django):  http://localhost:8000"
echo "   - Frontend (React):  http://localhost:3000"
echo ""
echo "📋 PIDs guardados en:"
echo "   - Django:  $(cat $PROJECT_ROOT/django_server.pid)"
echo "   - React:   $(cat $PROJECT_ROOT/react_server.pid)"
echo ""
echo "📄 Logs disponibles en:"
echo "   - Django:  $PROJECT_ROOT/django_server.log"
echo "   - React:   $PROJECT_ROOT/react_server.log"
echo ""
echo "🛑 Para detener los servidores:"
echo "   kill \$(cat $PROJECT_ROOT/django_server.pid) \$(cat $PROJECT_ROOT/react_server.pid)"
echo "   o ejecuta: ./scripts/stop_local_servers.sh"
echo ""
