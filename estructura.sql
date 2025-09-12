DROP DATABASE IF EXISTS paes;
CREATE DATABASE paes CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE paes;

CREATE TABLE materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
  rut VARCHAR(15) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rol ENUM('alumno','profesor') NOT NULL,
  materia_id INT,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE SET NULL
);

CREATE TABLE usuario_materia (
  rut VARCHAR(15),
  materia_id INT,
  PRIMARY KEY (rut, materia_id),
  FOREIGN KEY (rut) REFERENCES usuarios(rut) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  materia_id INT NOT NULL,
  texto TEXT NOT NULL,
  alt1 VARCHAR(255) NOT NULL,
  alt2 VARCHAR(255) NOT NULL,
  alt3 VARCHAR(255) NOT NULL,
  alt4 VARCHAR(255) NOT NULL,
  correcta TINYINT NOT NULL,
  explicacion TEXT NOT NULL,
  creador_rut VARCHAR(15) NOT NULL,
  es_libre BOOLEAN DEFAULT FALSE,
  creada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (materia_id) REFERENCES materias(id),
  FOREIGN KEY (creador_rut) REFERENCES usuarios(rut)
);

CREATE TABLE ensayos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  materia_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  creador_rut VARCHAR(15) NOT NULL,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (materia_id) REFERENCES materias(id),
  FOREIGN KEY (creador_rut) REFERENCES usuarios(rut)
);

DELIMITER //
CREATE TRIGGER verificar_materia_profesor_insert BEFORE INSERT ON ensayos
FOR EACH ROW BEGIN
  DECLARE profesor_materia_id INT;
  SELECT materia_id INTO profesor_materia_id FROM usuarios WHERE rut = NEW.creador_rut AND rol = 'profesor';
  IF NEW.materia_id != profesor_materia_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Un profesor solo puede crear ensayos de su materia asignada';
  END IF;
END //

CREATE TRIGGER verificar_materia_profesor_update BEFORE UPDATE ON ensayos
FOR EACH ROW BEGIN
  DECLARE profesor_materia_id INT;
  SELECT materia_id INTO profesor_materia_id FROM usuarios WHERE rut = NEW.creador_rut AND rol = 'profesor';
  IF NEW.materia_id != profesor_materia_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Un profesor solo puede modificar ensayos a su materia asignada';
  END IF;
END //
DELIMITER ;

CREATE TABLE ensayo_pregunta (
  ensayo_id INT NOT NULL,
  pregunta_id INT NOT NULL,
  orden INT DEFAULT 1,
  PRIMARY KEY (ensayo_id, pregunta_id),
  FOREIGN KEY (ensayo_id) REFERENCES ensayos(id) ON DELETE CASCADE,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER verificar_materia_pregunta BEFORE INSERT ON ensayo_pregunta
FOR EACH ROW BEGIN
  DECLARE ensayo_materia_id INT;
  DECLARE pregunta_materia_id INT;
  SELECT materia_id INTO ensayo_materia_id FROM ensayos WHERE id = NEW.ensayo_id;
  SELECT materia_id INTO pregunta_materia_id FROM preguntas WHERE id = NEW.pregunta_id;
  IF ensayo_materia_id != pregunta_materia_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo se pueden agregar preguntas de la misma materia que el ensayo';
  END IF;
END //
DELIMITER ;

CREATE TABLE resultados_ensayo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ensayo_id INT NOT NULL,
  usuario_rut VARCHAR(15) NOT NULL,
  respuestas_correctas INT NOT NULL,
  respuestas_incorrectas INT NOT NULL,
  porcentaje_buenas DECIMAL(5,2) NOT NULL,
  porcentaje_malas DECIMAL(5,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ensayo_id) REFERENCES ensayos(id),
  FOREIGN KEY (usuario_rut) REFERENCES usuarios(rut),
  UNIQUE KEY uq_user_ensayo (usuario_rut, ensayo_id)
);
ALTER TABLE resultados_ensayo ADD COLUMN respuestas JSON;