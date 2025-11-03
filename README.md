# Proyecto-INF225 (proyecto base INF236 2025-1)
Este es el repositorio del grupo 12, proyecto que tiene como base lo realizado en el ramo INF236 ("Analisis y diseño de software") del semestre 2025-1.
Este proyecto se basa en realizar una pagina de ensayos de la Prueba de Acceso a la Educación Superior (PAES) a una red de colegios.

Los integrantes son:

* Integrante 1: Gabriela Trigo - 202330561-8
* Integrante 2: Ignacio Figueroa - 202330536-7
* Integrante 3: Benjamin Matus - 202330546-4
* Integrante 4: Diego Acevedo - 202330504-9
* **Profesor**: Ricardo Salas Letelier
* **TUTOR**: Eduardo Mauricio Pino Huentelaf

## Descripción del Proyecto

Plataforma educativa diseñada para facilitar la preparación de estudiantes para la PAES a través de:
- Creación y gestión de ensayos por materia
- Sistema de preguntas con retroalimentación
- Modo de práctica libre para autoevaluación
- Seguimiento de resultados y progreso
- Interfaz diferenciada para profesores y alumnos

## Arquitectura del Sistema

**Stack Tecnológico:**
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Base de Datos: MySQL 8.0
- Contenedores: Docker + Docker Compose

**Componentes Principales:**
- Sistema de autenticación por RUT
- Gestión de preguntas por materia
- Sistema de resultados y retroalimentación
- Gestión de preguntas libres para autoevaluación

## Recursos Adicionales

- Wiki del proyecto: https://github.com/ifigueroa09/INF225_G12/wiki
- Video presentación cliente: https://aula.usm.cl/mod/resource/view.php?id=6322574
- Video avance prototipo: https://youtu.be/t5p1rI0LDxk
- Video resultado final 2024-2: https://youtu.be/kGIDwCZRdNo

## Instalación y Ejecución

### Requisitos Previos
- Docker Desktop instalado y en ejecución
- Git para clonar el repositorio

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/ifigueroa09/INF225_G12.git
cd INF225_G12
```

2. **Levantar todo el sistema:**
```bash
docker-compose up -d
```

3. Verificar que los contenedores están activos:
```bash
docker-compose ps
```

4. Acceder a la aplicación:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Base de datos MySQL: Puerto 3306

**Para detener el sistema:**
```bash
docker-compose down
```

Para eliminar también los volúmenes de datos:
```bash
docker-compose down -v
```

## Usuarios de Prueba

### Profesores (pueden crear ensayos y preguntas)
| RUT | Materia |
|-----|---------|
| 10000000-1 | Matemáticas M1 |
| 20000000-2 | Matemáticas M2 |
| 30000000-3 | Competencia Lectora |
| 40000000-4 | Historia |
| 50000000-5 | Ciencias |

### Alumnos (pueden realizar ensayos y practicar)
| RUT | Nombre |
|-----|--------|
| 11111111-1 | Alumno A |
| 22222222-2 | Alumno B |
| 33333333-3 | Alumno C |

## Funcionalidades Implementadas

### Para Profesores:
- Login con RUT y validación de rol
- Visualización de resultados de alumnos por materia
- Creación de preguntas con 4 alternativas
- Configuración de preguntas como libres para autoevaluación
- Creación de ensayos con preguntas seleccionadas
- Gestión de banco de preguntas por materia
- Vista consolidada de rendimiento por ensayo

### Para Alumnos:
- Login con RUT y nombre
- Selección de materia de interés
- Acceso a ensayos disponibles por materia
- Realización de ensayos completos
- Modo de práctica con preguntas libres
- Visualización de resultados con retroalimentación
- Revisión de respuestas correctas e incorrectas
- Historial de ensayos realizados

## Base de Datos

### Tablas Principales:
- `materias`: Definición de materias PAES
- `usuarios`: Profesores y alumnos del sistema
- `usuario_materia`: Relación alumnos-materias (N:M)
- `preguntas`: Banco de preguntas por materia
- `ensayos`: Ensayos creados por profesores
- `ensayo_pregunta`: Preguntas incluidas en cada ensayo
- `resultados_ensayo`: Resultados de alumnos por ensayo

## Pruebas Unitarias

El proyecto incluye pruebas automatizadas para los endpoints críticos:
- Creación de ensayos (autorización por rol)
- Envío de resultados (validación de datos)

Ver el archivo `INSTRUCCIONES_EJECUCION.md` para detalles de ejecución.



## Documentación Completa

Toda la documentación adicional (HU, pruebas, tablas de Input/Output/Contexto, Evaluación de Arquitectura, resultados y videos) está en la Wiki: https://github.com/ifigueroa09/INF225_G12/wiki

Incluye:



