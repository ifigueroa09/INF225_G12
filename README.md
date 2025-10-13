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

## Wiki
* Aqui puede acceder a la wiki [Enlace](https://github.com/ifigueroa09/INF225_G12/wiki)

## Videos
* [Video presentación cliente](https://aula.usm.cl/mod/resource/view.php?id=6322574)
* [Video Avance Prototipo](https://youtu.be/t5p1rI0LDxk)
* [Video Resultado final del prototipo](https://youtu.be/kGIDwCZRdNo)

## Cómo ejecutar el proyecto

### **Ejecución con Docker**

**Requisitos:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado

**Pasos:**

1. **Clonar el repositorio:**
```bash
git clone https://github.com/ifigueroa09/INF225_G12.git
cd INF225_G12
```

2. **Levantar todo el sistema:**
```bash
docker-compose up -d
```

3. **Acceder a la aplicación:**
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000
- **Base de datos:** Puerto 3306

**Para detener el sistema:**
```bash
docker-compose down
```

### **Credenciales de prueba:**

**Profesores:**
- RUT: `10000000-1` (Matemáticas M1)
- RUT: `20000000-2` (Matemáticas M2)
- RUT: `30000000-3` (Competencia Lectora)
- RUT: `40000000-4` (Historia)
- RUT: `50000000-5` (Ciencias)

**Alumnos:**
- RUT: `11111111-1`, Nombre: `Alumno A`
- RUT: `22222222-2`, Nombre: `Alumno B`
- RUT: `33333333-3`, Nombre: `Alumno C`

###  **Funcionalidades principales:**
- Sistema de login para profesores y alumnos
- Creación y gestión de preguntas por materia
- Ensayos PAES completos
- **Preguntas libres para autoevaluación**
- Resultados automáticos y retroalimentación

---

## Pruebas Unitarias

Este proyecto incluye pruebas unitarias para 2 endpoints de la API.

### Documentación
- [Casos de Prueba](CASOS_DE_PRUEBA.md) - Diseño de casos con clases de equivalencia
- [Instrucciones de Ejecución](INSTRUCCIONES_EJECUCION.md) - Guía para ejecutar las pruebas

### Ejecución Rápida

```powershell
pip install -r requirements.txt
python -m unittest discover -s tests -v
```

### Casos Implementados

**Endpoint: POST /api/ensayos**
- ✅ Creación exitosa de ensayo por profesor
- ✅ Rechazo de usuario no autorizado (alumno)

**Endpoint: POST /api/resultados**
- ✅ Envío exitoso de resultados por alumno
- ✅ Rechazo de datos faltantes/null

**Total:** 4 casos de prueba en 2 endpoints

### Ejecución Rápida

```powershell
pip install -r requirements.txt
python -m unittest discover -s tests -v
```

### Casos Implementados
- ✅ Creación exitosa de ensayo por profesor
- ✅ Rechazo de creación por usuario no autorizado (alumno)
