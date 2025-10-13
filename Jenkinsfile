pipeline {
    agent any

    stages {
        stage('Backend CI/CD') {
            steps {
                echo 'Iniciando el pipeline para el backend de Django...'
                dir('habit_tracker_backend') {
                    // Instalar dependencias de Python
                    sh 'pip install -r requirements.txt' 

                    // Ejecutar pruebas unitarias
                    sh 'python manage.py test' 

                    // Ejecutar migraciones de la base de datos
                    sh 'python manage.py makemigrations'
                    sh 'python manage.py migrate'
                    echo 'El backend está listo.'
                }
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
                    // Compilar la aplicación para producción
                    sh 'npm start' 
                    echo 'El frontend está compilado y listo para ser servido.'
                }
            }
        }
    }
}