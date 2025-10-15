pipeline {
    agent any

    stages {
        stage('Backend CI/CD') {
            steps {
                echo 'Iniciando el pipeline para el backend de Django...'
                // Instalar dependencias de Python
                sh 'pip install -r requirements.txt'

                // Ejecutar migraciones de la base de datos
                sh 'python manage.py makemigrations'
                sh 'python manage.py migrate'

                // Iniciar servidor Django en background
                sh 'python manage.py runserver 0.0.0.0:8000 &'
                echo 'El backend está corriendo en el puerto 8000.'
            }
        }

        stage('Frontend CI/CD') {
            tools {
                nodejs 'Node.js 18'
            }
            steps {
                echo 'Iniciando el pipeline para el frontend de React...'
                dir('habit-tracker-frontend') {
                    // Instalar dependencias de Node.js
                    sh 'npm install'

                    // Iniciar servidor React en background
                    sh 'npm start &'
                    echo 'El frontend está corriendo en el puerto 3000.'
                }
            }
        }
    }
}