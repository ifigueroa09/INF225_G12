# Proyecto-INF225 (proyecto base INF236 2025-1)
Este es el repositorio del grupo 14, cuyos integrantes son:

* Integrante 1: Gabriela Trigo - 202330561-8
* Integrante 2: Ignacio Figueroa - 202330536-7
* Integrante 3: Benjamin Matus - 202330546-4
* Integrante 4: Diego Acevedo - 202330504-9
* **Profesor**: Ricardo Salas Letelier
* **TUTOR**: Eduardo Mauricio Pino Huentelaf

## Wiki
* Aqui puede acceder a la wiki [Enlace](https://gitlab.com/Diego_Villanueva/grupo14-2025-proyinf/-/wikis/home)

## Videos
* [Video presentación cliente](https://aula.usm.cl/mod/resource/view.php?id=6322574)
* [Video Avance Prototipo](https://youtu.be/t5p1rI0LDxk)
* [Video Resultado final del prototipo](https://youtu.be/kGIDwCZRdNo)

## Pasos para levantar el proyecto y elementos necesarios
**Componentes utilizadas y necesarias:**

Frontend: React + Vite

Backend: Node.js + Express

Base de datos: MySQL (opcional)

Web que permite a alumnos practicar ensayos PAES, respondiendo preguntas y profesores viendo sus resultados automaticamente

Descargar: (https://nodejs.org/) version LTS

Descargar el proyecto y ubicarlo en tu computador.

**Pasos**

Abrir terminal en la carpeta raíz del proyecto y ejecutar:

npm install express cors mysql2

Luego entrar al frontend: cd frontend

npm install

En caso de no funcionar usar (Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned) en la terminal.

Crear la base de datos con el archivo [estructura.sql] y poblarla con el archivo [data.sql]

Verificar que en le archivo server.js este correcta la conexion:

const conn = mysql.createConnection({

  host: 'localhost',

  user: 'root',

  password: '',

  database: 'paes'

});

**Se debe tener creada la BD para que el backend funcione correctamente.**

Para iniciar se debe estar en la carpeta raiz y en la terminal se debe escribir:
Iniciar Parte Backend

cd backend

node server.js

[Respuesta esperada]:Servidor corriendo en puerto 3001

Iniciar Parte Frontend

cd frontend

npm run dev
