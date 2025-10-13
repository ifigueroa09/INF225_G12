# Casos de Prueba - Endpoint POST /api/ensayos

## Análisis del Endpoint

El endpoint `POST /api/ensayos` permite crear nuevos ensayos. Requiere:
- `materia_id`: ID de la materia
- `titulo`: Título del ensayo
- `creador_rut`: RUT del usuario que crea el ensayo
- `preguntas`: Array con IDs de preguntas

### Validaciones del Sistema
- Solo usuarios con rol "profesor" pueden crear ensayos
- El profesor debe tener asignada la materia del ensayo
- Las preguntas deben pertenecer a la misma materia

---

## Técnicas de Diseño de Pruebas Aplicadas

### 1. Clases de Equivalencia

Se identificaron las siguientes clases para los parámetros principales:

#### Parámetro: creador_rut
| Clase | Descripción | Tipo |
|-------|-------------|------|
| CE1 | RUT de usuario con rol "profesor" y materia asignada | Válida |
| CE2 | RUT de usuario con rol "alumno" | Inválida |
| CE3 | RUT que no existe en la base de datos | Inválida |

#### Parámetro: materia_id
| Clase | Descripción | Tipo |
|-------|-------------|------|
| CE4 | ID que coincide con la materia del profesor | Válida |
| CE5 | ID diferente a la materia del profesor | Inválida |

#### Parámetro: preguntas
| Clase | Descripción | Tipo |
|-------|-------------|------|
| CE6 | Array con IDs de preguntas de la misma materia | Válida |
| CE7 | Array vacío | Válida |
| CE8 | Array con IDs de preguntas de otra materia | Inválida |

### 2. Valores Frontera

Se identificaron los siguientes valores frontera:

| Campo | Valores Frontera | Propósito |
|-------|------------------|-----------|
| `preguntas` | `[]`, `[1]`, `[1,2]`, `[1,2,...,N]` | Probar límites de cantidad de preguntas |
| `titulo` | `""`, `"A"`, `"Texto de 255 caracteres"` | Probar límites de longitud |

---

## Caso de Prueba 1: Creación Exitosa de Ensayo

### Objetivo
Verificar que un profesor autorizado puede crear un ensayo correctamente.

### Técnica Aplicada
- **Clase de Equivalencia**: CE1 (profesor válido) + CE4 (materia correcta) + CE6 (preguntas válidas)
- **Valor Frontera**: Array con 2 preguntas (valor mínimo recomendado para un ensayo)

### Tabla de Caso de Prueba

| Aspecto | Detalle |
|---------|---------|
| **Inputs** | `materia_id`: 1<br>`titulo`: "Ensayo de Prueba"<br>`creador_rut`: "123456789" (profesor)<br>`preguntas`: [1, 2] |
| **Salida Esperada** | Código HTTP: 200<br>Respuesta: `{"ensayo_id": <número>}`<br>Registro creado en BD |
| **Contexto de Ejecución** | **Precondiciones:**<br>- Existe materia con id=1<br>- Existe usuario profesor con RUT 123456789 y materia_id=1<br>- Existen preguntas con id 1 y 2 de materia_id=1<br>- Backend corriendo en localhost:3000<br>**Postcondiciones:**<br>- Se crea 1 registro en tabla `ensayos`<br>- Se crean 2 registros en tabla `ensayo_pregunta` |

### Justificación del Diseño
Este caso prueba la **clase de equivalencia válida principal**: un usuario con permisos correctos crea un ensayo con datos válidos. Se usa un **valor frontera** de 2 preguntas, que representa el mínimo práctico para un ensayo funcional.

---

## Caso de Prueba 2: Rechazo de Usuario No Autorizado

### Objetivo
Verificar que el sistema rechaza correctamente a usuarios sin rol de profesor.

### Técnica Aplicada
- **Clase de Equivalencia**: CE2 (usuario alumno - clase inválida para creación de ensayos)
- **Validación funcional**: Prueba de autorización y control de acceso

### Tabla de Caso de Prueba

| Aspecto | Detalle |
|---------|---------|
| **Inputs** | `materia_id`: 1<br>`titulo`: "Ensayo por Alumno"<br>`creador_rut`: "987654321" (alumno)<br>`preguntas`: [1] |
| **Salida Esperada** | Código HTTP: 403 Forbidden<br>Mensaje: "Usuario no encontrado o no es profesor"<br>NO se crea registro en BD |
| **Contexto de Ejecución** | **Precondiciones:**<br>- Existe materia con id=1<br>- Existe usuario alumno con RUT 987654321<br>- Existe pregunta con id=1 de materia_id=1<br>- Backend corriendo en localhost:3000<br>**Postcondiciones:**<br>- NO se crea ningún registro en `ensayos`<br>- Cantidad de ensayos permanece igual |

### Justificación del Diseño
Este caso prueba una **clase de equivalencia inválida** (usuario sin permisos). Varía funcionalmente del Caso 1 porque evalúa la **validación de autorización** del sistema, no la creación exitosa. Es un caso de prueba negativo que verifica que el control de acceso funciona correctamente.

---

## Resumen de Cobertura

| Caso | Clase de Equivalencia | Valor Frontera | Aspecto Funcional Probado |
|------|-----------------------|----------------|---------------------------|
| CP1 | CE1 + CE4 + CE6 (válidas) | 2 preguntas (mínimo) | Creación exitosa con permisos correctos |
| CP2 | CE2 (inválida) | N/A | Validación de autorización por rol |

**Variación funcional:** Los casos difieren en propósito (éxito vs fallo), validación probada (datos vs permisos), y resultado esperado (200 vs 403).

---

# Casos de Prueba - Endpoint POST /api/resultados

## Análisis del Endpoint

El endpoint `POST /api/resultados` permite enviar los resultados de un ensayo completado por un alumno. Requiere:
- `ensayo_id`: ID del ensayo
- `usuario_rut`: RUT del alumno
- `correctas`: Cantidad de respuestas correctas
- `incorrectas`: Cantidad de respuestas incorrectas
- `porcentaje_buenas`: Porcentaje de aciertos
- `porcentaje_malas`: Porcentaje de errores
- `respuestas`: Array con las respuestas del alumno (JSON)

### Validaciones del Sistema
- El ensayo debe existir en la base de datos
- El usuario debe existir
- Si ya existe un resultado previo para ese ensayo y alumno, se elimina y se reemplaza por el nuevo

---

## Técnicas de Diseño de Pruebas Aplicadas

### 1. Clases de Equivalencia

Se identificaron las siguientes clases para los parámetros principales:

#### Parámetro: ensayo_id
| Clase | Descripción | Tipo |
|-------|-------------|------|
| CE9 | ID de ensayo que existe en la BD | Válida |
| CE10 | ID de ensayo que no existe | Inválida |

#### Parámetro: usuario_rut
| Clase | Descripción | Tipo |
|-------|-------------|------|
| CE11 | RUT de usuario alumno válido | Válida |
| CE12 | RUT que no existe en la BD | Inválida |

#### Parámetro: respuestas (array de respuestas)
| Clase | Descripción | Tipo |
|-------|-------------|------|
| CE13 | Array con respuestas válidas | Válida |
| CE14 | Array vacío | Inválida |
| CE15 | Datos null o undefined | Inválida |

### 2. Valores Frontera

Se identificaron los siguientes valores frontera:

| Campo | Valores Frontera | Propósito |
|-------|------------------|-----------|
| `correctas` | 0, 1, N (todas) | Probar límites de calificación |
| `porcentaje_buenas` | 0%, 50%, 100% | Probar rangos de porcentaje |
| `respuestas` | Array vacío, 1 respuesta, N respuestas | Probar límites de cantidad |

---

## Caso de Prueba 3: Envío Exitoso de Resultados

### Objetivo
Verificar que un alumno puede enviar correctamente los resultados de un ensayo completado.

### Técnica Aplicada
- **Clase de Equivalencia**: CE9 (ensayo existente) + CE11 (alumno válido) + CE13 (respuestas válidas)
- **Valor Frontera**: Calificación intermedia (50% de aciertos)

### Tabla de Caso de Prueba

| Aspecto | Detalle |
|---------|---------|
| **Inputs** | `ensayo_id`: 1<br>`usuario_rut`: "111111111" (alumno)<br>`correctas`: 1<br>`incorrectas`: 1<br>`porcentaje_buenas`: 50<br>`porcentaje_malas`: 50<br>`respuestas`: [{"pregunta_id": 1, "respuesta": 1}, {"pregunta_id": 2, "respuesta": 2}] |
| **Salida Esperada** | Código HTTP: 200<br>Respuesta: "ok"<br>Registro creado/actualizado en BD |
| **Contexto de Ejecución** | **Precondiciones:**<br>- Existe ensayo con id=1<br>- Existe usuario alumno con RUT 111111111<br>- Backend corriendo en localhost:3000<br>**Postcondiciones:**<br>- Se crea o actualiza 1 registro en tabla `resultados_ensayo`<br>- Si existía resultado previo, se elimina primero |

### Justificación del Diseño
Este caso prueba la **clase de equivalencia válida**: alumno envía resultados con datos correctos. Se usa un **valor frontera** de 50% de aciertos para probar un caso intermedio (ni muy alto ni muy bajo).

---

## Caso de Prueba 4: Envío con Datos Faltantes

### Objetivo
Verificar que el sistema maneja correctamente el caso cuando faltan campos obligatorios.

### Técnica Aplicada
- **Clase de Equivalencia**: CE15 (datos faltantes o null - clase inválida)
- **Validación funcional**: Prueba de validación de datos de entrada

### Tabla de Caso de Prueba

| Aspecto | Detalle |
|---------|---------|
| **Inputs** | `ensayo_id`: 1<br>`usuario_rut`: "111111111"<br>`correctas`: null<br>`incorrectas`: null<br>`porcentaje_buenas`: null<br>`porcentaje_malas`: null<br>`respuestas`: null |
| **Salida Esperada** | Código HTTP: 500 (error interno)<br>Mensaje de error relacionado con campos null<br>NO se crea registro en BD |
| **Contexto de Ejecución** | **Precondiciones:**<br>- Existe ensayo con id=1<br>- Existe usuario alumno con RUT 111111111<br>- Backend corriendo en localhost:3000<br>**Postcondiciones:**<br>- NO se crea ningún registro en `resultados_ensayo`<br>- Cantidad de resultados permanece igual |

### Justificación del Diseño
Este caso prueba una **clase de equivalencia inválida** (datos faltantes). Varía funcionalmente del Caso 3 porque evalúa la **validación de datos de entrada** del sistema, no el proceso exitoso. Es un caso de prueba negativo que verifica que el sistema no acepta datos incompletos.

---

## Resumen de Cobertura - Ambos Endpoints

| Endpoint | Caso | Clase de Equivalencia | Valor Frontera | Aspecto Funcional |
|----------|------|-----------------------|----------------|-------------------|
| POST /api/ensayos | CP1 | CE1 + CE4 + CE6 (válidas) | 2 preguntas | Creación con permisos |
| POST /api/ensayos | CP2 | CE2 (inválida) | N/A | Validación de autorización |
| POST /api/resultados | CP3 | CE9 + CE11 + CE13 (válidas) | 50% aciertos | Envío exitoso de resultados |
| POST /api/resultados | CP4 | CE15 (inválida) | N/A | Validación de datos requeridos |

**Cobertura total:** 4 casos de prueba distribuidos en 2 endpoints, probando tanto flujos exitosos como validaciones de error.
