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
