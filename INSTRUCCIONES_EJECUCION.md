# Instrucciones de Ejecución

## Contenido
1. Ejecución del Sistema Completo
2. Ejecución de Pruebas Unitarias
3. Solución de Problemas Comunes

---

## 1. Ejecución del Sistema Completo

### Requisitos Previos
- Docker Desktop instalado y ejecutándose
- Puertos 80, 3000 y 3306 disponibles
- Git (para clonar el repositorio)

### Pasos para Ejecutar

#### Windows (PowerShell):
```powershell
# Clonar el repositorio
git clone https://github.com/ifigueroa09/INF225_G12.git
cd INF225_G12

# Iniciar todos los servicios
docker-compose up -d

# Verificar estado de contenedores
docker-compose ps



#### Linux/Mac:
```bash
# Clonar el repositorio
git clone https://github.com/ifigueroa09/INF225_G12.git
cd INF225_G12

# Iniciar todos los servicios
docker-compose up -d

# Verificar estado de contenedores
docker-compose ps


```

### Acceso al Sistema

Una vez iniciado, el sistema está disponible en:
- Frontend (interfaz web): http://localhost
- Backend API: http://localhost:3000
- Base de datos MySQL: localhost:3306

### Detener el Sistema

```bash
# Detener servicios
docker-compose down

# Detener y eliminar datos
docker-compose down -v
```

---

## 2. Ejecución de Pruebas Unitarias

### Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Sistema completo ejecutándose (ver sección 1)

### Instalación de Dependencias

#### Windows (PowerShell):
```powershell
pip install -r requirements.txt
```

#### Linux/Mac:
```bash
pip3 install -r requirements.txt
```

### Verificar Backend Activo

Antes de ejecutar las pruebas, verificar que el backend responde:

#### Windows (PowerShell):
```powershell
curl http://localhost:3000/api/preguntas
```

## Ejecutar Pruebas

### Todas las pruebas (ambos endpoints)
```powershell
python -m unittest discover -s tests -v
```

### Pruebas de un endpoint específico
```powershell
# Solo POST /api/ensayos
python -m unittest tests.test_crear_ensayo -v

# Solo POST /api/resultados
python -m unittest tests.test_enviar_resultados -v
```

### Una prueba específica
```powershell
python -m unittest tests.test_crear_ensayo.TestCrearEnsayo.test_crear_ensayo_exitoso
```

## Casos de Prueba Implementados

#### Endpoint: POST /api/ensayos
- test_crear_ensayo_exitoso: Profesor autorizado crea ensayo exitosamente
- test_crear_ensayo_usuario_no_profesor: Alumno no puede crear ensayo (403)

#### Endpoint: POST /api/resultados
- test_enviar_resultados_exitoso: Alumno envía resultados válidos
- test_enviar_resultados_datos_faltantes: Rechazo de datos null/incompletos (500)

Total: 4 casos de prueba en 2 endpoints críticos

### Interpretación de Resultados

### Exitoso
```
Ran 4 tests in X.XXXs
OK
```
Todas las pruebas pasaron correctamente.

### Fallido
```
FAIL: test_crear_ensayo_exitoso
AssertionError: ...
```
Una o más pruebas fallaron. Revisar el mensaje de error.

## Solución de Problemas

| Error | Solución |
|-------|----------|
| Connection refused | Iniciar el backend con `npm start` |
| Module 'requests' not found | Ejecutar `pip install requests` |
| Status 500 | Revisar logs del backend |

## Notas

- Las pruebas crean datos temporales en la BD
- No se eliminan automáticamente (el backend no tiene DELETE)
- Se pueden ejecutar múltiples veces sin problema
