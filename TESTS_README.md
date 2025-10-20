# Tests Unitarios - Habit Tracker

Este proyecto incluye tests unitarios simples para demostrar el funcionamiento del pipeline CI/CD.

## Backend Tests (Python/Django)

Ubicación: `habits/tests.py`

### Tests implementados:

1. **test_habit_creation**: Verifica que un hábito se crea correctamente con todos sus campos
2. **test_habit_string_representation**: Verifica la representación en string del modelo Habit
3. **test_daily_log_creation**: Verifica que un log diario se crea correctamente
4. **test_daily_log_completion_toggle**: Verifica que se puede cambiar el estado de completado

### Ejecutar tests de backend:

```bash
# Activar virtualenv
source venv/bin/activate

# Configurar Django settings
export DJANGO_SETTINGS_MODULE=habit_tracker_backend.settings

# Ejecutar todos los tests
pytest habits/tests.py -v

# Ejecutar tests con coverage
coverage run -m pytest
coverage report -m
```

## Frontend Tests (React/Jest)

Ubicación: `habit-tracker-frontend/src/components/`

### Tests implementados:

1. **HabitCard.test.js** (4 tests):

   - Validación de estructura del objeto hábito
   - Verificación de propiedades requeridas
   - Validación de tipos de datos
   - Verificación de valores válidos

2. **App.test.js** (2 tests):
   - Test básico de funcionamiento
   - Verificación de variables de entorno

### Ejecutar tests de frontend:

```bash
# Ir al directorio del frontend
cd habit-tracker-frontend

# Instalar dependencias (si no están instaladas)
npm install

# Ejecutar tests en modo CI
npm test -- --ci --watchAll=false

# Ejecutar tests en modo watch (desarrollo)
npm test
```

## Ejecutar todos los tests (Backend + Frontend)

Puedes usar el script del pipeline que ejecuta ambos:

```bash
# Dar permisos al script
chmod +x scripts/run_local_prod.sh

# Ejecutar pipeline completo (incluye tests)
./scripts/run_local_prod.sh
```

## Resultados esperados

- **Backend**: 4 tests pasando ✅
- **Frontend**: 6 tests pasando ✅
- **Total**: 10 tests pasando ✅

## Notas

- Los tests son simples y están diseñados para demostrar el funcionamiento del pipeline CI/CD
- Los tests de backend usan la base de datos SQLite en modo de prueba
- Los tests de frontend son unitarios y no requieren un servidor corriendo
- Todos los tests se ejecutan automáticamente en el Jenkinsfile
