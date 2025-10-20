#!/usr/bin/env bash

# Script: stop_local_servers.sh
# Propósito: Detener los servidores locales (Django y React)
# Uso: ./scripts/stop_local_servers.sh

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🛑 Deteniendo servidores locales..."

# Detener usando PIDs guardados
if [ -f "$PROJECT_ROOT/django_server.pid" ]; then
    DJANGO_PID=$(cat "$PROJECT_ROOT/django_server.pid")
    kill $DJANGO_PID 2>/dev/null && echo "✅ Servidor Django (PID: $DJANGO_PID) detenido"
    rm "$PROJECT_ROOT/django_server.pid"
fi

if [ -f "$PROJECT_ROOT/react_server.pid" ]; then
    REACT_PID=$(cat "$PROJECT_ROOT/react_server.pid")
    kill $REACT_PID 2>/dev/null && echo "✅ Servidor React (PID: $REACT_PID) detenido"
    rm "$PROJECT_ROOT/react_server.pid"
fi

# Asegurar que todos los procesos estén detenidos
pkill -f 'python.*manage.py runserver' 2>/dev/null && echo "✅ Procesos Django adicionales detenidos"
pkill -f 'node.*react-scripts' 2>/dev/null && echo "✅ Procesos React adicionales detenidos"

echo ""
echo "✅ Todos los servidores han sido detenidos."
