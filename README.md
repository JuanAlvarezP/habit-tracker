# Habit Tracker

Un sistema completo de seguimiento de hábitos construido con Django REST Framework (backend) y React (frontend).

## Características

- 🎯 Seguimiento de hábitos diarios
- 📊 Visualización de progreso
- 👤 Sistema de autenticación de usuarios
- 📱 Interfaz responsiva
- 🔐 API RESTful segura

## Tecnologías Utilizadas

### Backend
- Django REST Framework
- Python 3.11
- SQLite (base de datos)

### Frontend
- React
- JavaScript/JSX
- CSS3

## Estructura del Proyecto

```
habit-tracker/
├── habit_tracker_backend/    # Configuración principal de Django
├── habits/                   # App de Django para hábitos
├── habit-tracker-frontend/   # Aplicación React
├── manage.py                 # Script de gestión de Django
└── requirements.txt          # Dependencias de Python
```

## Instalación y Configuración

### Backend (Django)

1. Crear y activar un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Ejecutar migraciones:
```bash
python manage.py migrate
```

4. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

5. Ejecutar el servidor de desarrollo:
```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000/`

### Frontend (React)

1. Navegar al directorio del frontend:
```bash
cd habit-tracker-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar la aplicación:
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000/`

## API Endpoints

- `GET/POST /api/habits/` - Listar/crear hábitos
- `GET/PUT/DELETE /api/habits/{id}/` - Detalles/actualizar/eliminar hábito específico
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrar usuario

## Contribución

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.

## Autor

Juan Álvarez