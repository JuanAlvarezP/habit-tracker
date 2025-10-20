#!/usr/bin/env bash

# Script: check_status.sh
# Propósito: Verificar el estado de los servidores del Habit Tracker
# Uso: ./scripts/check_status.sh

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔍 Verificando estado del sistema Habit Tracker..."
echo ""

# Verificar procesos
echo "📋 Procesos corriendo:"
DJANGO_PROC=$(ps aux | grep -E "manage.py runserver" | grep -v grep)
REACT_PROC=$(ps aux | grep -E "react-scripts" | grep -v grep)

if [ -n "$DJANGO_PROC" ]; then
    echo "✅ Django server está corriendo"
    echo "   $DJANGO_PROC" | head -1
else
    echo "❌ Django server NO está corriendo"
fi

if [ -n "$REACT_PROC" ]; then
    echo "✅ React server está corriendo"
    echo "   $REACT_PROC" | head -1
else
    echo "❌ React server NO está corriendo"
fi
echo ""

# Verificar puertos
echo "🌐 Puertos escuchando:"
if lsof -i :8000 >/dev/null 2>&1; then
    echo "✅ Puerto 8000 (Django) está en uso"
else
    echo "❌ Puerto 8000 NO está en uso"
fi

if lsof -i :3000 >/dev/null 2>&1; then
    echo "✅ Puerto 3000 (React) está en uso"
else
    echo "❌ Puerto 3000 NO está en uso"
fi
echo ""

# Verificar PIDs
echo "📄 Archivos PID:"
if [ -f "$PROJECT_ROOT/django_server.pid" ]; then
    PID=$(cat "$PROJECT_ROOT/django_server.pid")
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ django_server.pid existe y el proceso está vivo (PID: $PID)"
    else
        echo "⚠️  django_server.pid existe pero el proceso está muerto (PID: $PID)"
    fi
else
    echo "❌ django_server.pid no encontrado"
fi

if [ -f "$PROJECT_ROOT/react_server.pid" ]; then
    PID=$(cat "$PROJECT_ROOT/react_server.pid")
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ react_server.pid existe y el proceso está vivo (PID: $PID)"
    else
        echo "⚠️  react_server.pid existe pero el proceso está muerto (PID: $PID)"
    fi
else
    echo "❌ react_server.pid no encontrado"
fi
echo ""

# Test de conectividad
echo "🔗 Test de conectividad:"
if curl -s -f http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Django responde en http://localhost:8000"
else
    echo "❌ Django no responde en http://localhost:8000"
fi

if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ React responde en http://localhost:3000"
else
    echo "❌ React no responde en http://localhost:3000"
fi
echo ""

# Logs
echo "📄 Logs disponibles:"
if [ -f "$PROJECT_ROOT/django_server.log" ]; then
    LINES=$(wc -l < "$PROJECT_ROOT/django_server.log")
    echo "✅ django_server.log ($LINES líneas)"
else
    echo "❌ django_server.log no encontrado"
fi

if [ -f "$PROJECT_ROOT/react_server.log" ]; then
    LINES=$(wc -l < "$PROJECT_ROOT/react_server.log")
    echo "✅ react_server.log ($LINES líneas)"
else
    echo "❌ react_server.log no encontrado"
fi
echo ""

# Resumen final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -n "$DJANGO_PROC" ] && [ -n "$REACT_PROC" ]; then
    echo "✅ ESTADO: Todos los servidores están corriendo"
    echo ""
    echo "🌐 Accede a la aplicación en:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
elif [ -n "$DJANGO_PROC" ] || [ -n "$REACT_PROC" ]; then
    echo "⚠️  ESTADO: Solo algunos servidores están corriendo"
    echo ""
    echo "Para iniciar todos los servidores:"
    echo "   ./scripts/start_local_servers.sh"
else
    echo "❌ ESTADO: No hay servidores corriendo"
    echo ""
    echo "Para iniciar los servidores:"
    echo "   ./scripts/start_local_servers.sh"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
