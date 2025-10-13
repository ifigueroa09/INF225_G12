# Casos de Prueba - Endpoint POST /api/ensayos

## Análisis del Endpoint

El endpoint `POST /api/ensayos` permite crear nuevos ensayos. Requiere:
- `materia_id`: ID de la materia
- `titulo`: Título del ensayo
- `creador_rut`: RUT del usuario que crea el ensayo
- `preguntas`: Array con IDs de preguntas

### Validaciones
- Solo usuarios con rol "profesor" pueden crear ensayos
- El profesor debe tener asignada la materia del ensayo
- Las preguntas deben pertenecer a la misma materia

## Clases de Equivalencia

### Para creador_rut:
- **Válida**: RUT de usuario con rol "profesor"
- **Inválida**: RUT de usuario con rol "alumno"
- **Inválida**: RUT que no existe

### Para materia_id:
- **Válida**: ID que coincide con la materia del profesor
- **Inválida**: ID diferente a la materia del profesor

### Para preguntas:
- **Válida**: Array con IDs de preguntas de la misma materia
- **Válida**: Array vacío
- **Inválida**: Array con IDs de preguntas de otra materia

## Caso de Prueba 1: Creación Exitosa

### Descripción
Verificar que un profesor puede crear un ensayo de su materia.

### Datos de Entrada
- materia_id: 1
- titulo: "Ensayo de Prueba"
- creador_rut: "123456789" (profesor)
- preguntas: [1, 2]

### Resultado Esperado
- Código HTTP: 200
- Respuesta: `{"ensayo_id": <número>}`
- Se crea el registro en la BD

### Precondiciones
- Existe materia con id=1
- Existe usuario profesor con RUT 123456789 y materia_id=1
- Existen preguntas con id 1 y 2 de materia_id=1

## Caso de Prueba 2: Usuario No Autorizado

### Descripción
Verificar que un alumno NO puede crear ensayos.

### Datos de Entrada
- materia_id: 1
- titulo: "Ensayo por Alumno"
- creador_rut: "987654321" (alumno)
- preguntas: [1]

### Resultado Esperado
- Código HTTP: 403
- Mensaje: "Usuario no encontrado o no es profesor"
- NO se crea registro en la BD

### Precondiciones
- Existe usuario alumno con RUT 987654321
