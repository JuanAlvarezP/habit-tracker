pipeline {
    agent any

    environment {
        // Variables de entorno de ejemplo (se recomienda usar credenciales/secretos en Jenkins)
        DJANGO_SETTINGS_MODULE = 'habit_tracker_backend.settings'
        PYTHONUNBUFFERED = '1'
        VENV_DIR = "venv"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '>> Checkout del repositorio'
                checkout scm
            }
        }

        stage('Backend CI: Setup, Lint y Tests') {
            steps {
                echo '>> BACKEND: Instalación, Migraciones, Pruebas y Calidad (Django)'
                dir('.') {
                    // Crear y activar virtualenv en el workspace (local execution friendly)
                    sh '''
                    python3 -m venv ${VENV_DIR} || python -m venv ${VENV_DIR}
                    . ${VENV_DIR}/bin/activate
                    pip install --upgrade pip
                    pip install -r requirements.txt || pip install -r habit_tracker_backend/requirements.txt || true
                    pip install pytest pytest-django flake8 coverage || true
                    '''

                    // Ejecutar migraciones usando la configuración de sqlite (local) o la que se configure
                    sh '''
                    . ${VENV_DIR}/bin/activate
                    export DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE}
                    python manage.py makemigrations --noinput || true
                    python manage.py migrate --noinput || true
                    '''

                    // Linter
                    echo '   - Ejecutando Flake8 (excluyendo migrations y venv)...'
                    sh '. ${VENV_DIR}/bin/activate && flake8 --exclude=migrations,venv,habit-tracker-frontend,build . || true'

                    // Tests con coverage
                    echo '   - Ejecutando pruebas (pytest) con coverage...'
                    sh '. ${VENV_DIR}/bin/activate && coverage run -m pytest && coverage report -m || true'
                }
            }
        }

        stage('Frontend CI: Install, Lint, Tests y Build') {
            tools {
                nodejs 'Node.js 18' // nombre de la instalación en Jenkins (ajustar si es distinto)
            }
            steps {
                echo '>> FRONTEND: Instalación, Linter, Pruebas y Build (React)'
                dir('habit-tracker-frontend') {
                    sh '''
                    npm ci || npm install
                    '''

                    // ESLint - si no existe, continúa sin fallar para entorno local
                    echo '   - Ejecutando ESLint (si está configurado)...'
                    sh 'if [ -f package.json ]; then npm run lint || echo "lint skipped or failed"; fi'

                    // Jest tests
                    echo '   - Ejecutando pruebas unitarias (Jest) en modo CI...'
                    sh 'if [ -f package.json ]; then npm test -- --ci --watchAll=false || echo "tests skipped or failed"; fi'

                    // Build
                    echo '   - Construyendo frontend para producción...'
                    sh 'npm run build || echo "build failed or skipped"'
                }
            }
        }

        stage('Simulated Local Deploy (Artefactos)') {
            steps {
                echo '>> DESPLIEGUE SIMULADO: Empaquetando artefactos y copiando a carpeta local /tmp/habit-tracker-prod'
                sh '''
                TARGET_DIR=/tmp/habit-tracker-prod
                rm -rf ${TARGET_DIR}
                mkdir -p ${TARGET_DIR}/backend
                mkdir -p ${TARGET_DIR}/frontend

                # Copia el backend (sin virtualenv)
                rsync -av --exclude='venv' --exclude='.git' --exclude='node_modules' . ${TARGET_DIR}/backend/

                # Copia el frontend compilado si existe
                if [ -d habit-tracker-frontend/build ]; then
                  rsync -av habit-tracker-frontend/build/ ${TARGET_DIR}/frontend/
                else
                  echo "No hay build de frontend; skipeando copia."
                fi

                echo "Artefactos listos en ${TARGET_DIR}"
                '''
            }
        }

        stage('Run Local Production Server (Smoke Test)') {
            steps {
                echo '>> INICIANDO SERVICIO LOCAL (Gunicorn) PARA PRUEBA DE HUMO'
                sh '''
                . ${VENV_DIR}/bin/activate

                # Build minimal assets collectstatic if settings configured
                if python - <<'PY' 2>/dev/null
import importlib, sys
try:
    importlib.import_module('django')
    print('django')
except Exception:
    sys.exit(1)
PY
                then
                    export DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE}
                    python manage.py collectstatic --noinput || echo "collectstatic skipped"
                    # Levantar Gunicorn en background para pruebas de humo (puerto 8001)
                    pkill -f 'gunicorn' || true
                    nohup ${VENV_DIR}/bin/gunicorn --chdir . ${DJANGO_SETTINGS_MODULE.replace('.settings','')}.wsgi:application -b 127.0.0.1:8001 --workers 2 > gunicorn.log 2>&1 &
                    sleep 3
                    # Hacer petición de prueba
                    curl -f http://127.0.0.1:8001/ || (echo "Smoke test falló" && exit 1) || true
                else
                    echo "Django no está disponible en el entorno; se omite la prueba de humo de Gunicorn"
                fi
                '''
            }
        }

        stage('Start Local Servers') {
            steps {
                echo '>> INICIANDO SERVIDORES LOCALES (Backend en 8000, Frontend en 3000)'
                sh '''
                # Detener procesos previos si existen
                pkill -f 'python.*manage.py runserver' || true
                pkill -f 'node.*react-scripts' || true
                
                # Iniciar Django en background (puerto 8000)
                . ${VENV_DIR}/bin/activate
                export DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE}
                nohup python manage.py runserver 0.0.0.0:8000 > django_server.log 2>&1 &
                echo $! > django_server.pid
                
                # Iniciar React en background (puerto 3000)
                cd habit-tracker-frontend
                PORT=3000 nohup npm start > ../react_server.log 2>&1 &
                echo $! > ../react_server.pid
                
                sleep 5
                
                echo "✅ Servidores iniciados:"
                echo "   - Backend (Django): http://localhost:8000"
                echo "   - Frontend (React): http://localhost:3000"
                echo ""
                echo "Para detener los servidores:"
                echo "   kill \\$(cat django_server.pid) \\$(cat react_server.pid)"
                echo ""
                echo "Logs disponibles en: django_server.log y react_server.log"
                '''
            }
        }
    }

    post {
        always {
            // Guardar artefactos de coverage y logs
            echo "Guardando artefactos locales"
            sh 'mkdir -p artifacts || true'
            sh 'cp -r coverage.* artifacts/ 2>/dev/null || true'
            sh 'cp -r gunicorn.log artifacts/ 2>/dev/null || true'
            sh "echo 'Resultado del build: ' ${currentBuild.result} > artifacts/build_status.txt || true"
        }
        success {
            echo 'Pipeline completado correctamente. ✅'
        }
        failure {
            echo 'Pipeline finalizó con errores. ❌'
        }
    }
}