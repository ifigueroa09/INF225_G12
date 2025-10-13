# Instrucciones de Ejecución - Pruebas Unitarias

## Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes)
- Backend corriendo en `http://localhost:3000`
- Base de datos MySQL activa

## Instalación

1. Instalar dependencias:
```powershell
pip install -r requirements.txt
```

2. Verificar que el backend está corriendo:
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

### Endpoint: POST /api/ensayos
1. ✅ Creación exitosa de ensayo por profesor
2. ❌ Rechazo de usuario no autorizado (alumno)

### Endpoint: POST /api/resultados
3. ✅ Envío exitoso de resultados por alumno
4. ❌ Rechazo de datos faltantes/null

**Total: 4 casos de prueba en 2 endpoints**

## Interpretación de Resultados

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
